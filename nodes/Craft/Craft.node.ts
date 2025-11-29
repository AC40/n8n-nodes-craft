import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchItems,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	ResourceMapperFields,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftProperties } from './descriptions';
import { craftApiRequest } from './helpers';
import { blockDelete } from './operations/block/blockDelete';
import { blockFetch } from './operations/block/blockFetch';
import { blockInsert } from './operations/block/blockInsert';
import { blockMove } from './operations/block/blockMove';
import { blockSearch } from './operations/block/blockSearch';
import { blockUpdate } from './operations/block/blockUpdate';
import { blockUpload } from './operations/block/blockUpload';
import { collectionCreate } from './operations/collection/collectionCreate';
import { collectionDelete } from './operations/collection/collectionDelete';
import { collectionList } from './operations/collection/collectionList';
import { collectionListCollections } from './operations/collection/collectionListCollections';
import { collectionGetSchema } from './operations/collection/collectionGetSchema';
import { collectionUpdate } from './operations/collection/collectionUpdate';
import { blockConstruct } from './operations/block/blockConstruct';
import { taskList } from './operations/task/taskList';
import { taskCreate } from './operations/task/taskCreate';
import { taskUpdate } from './operations/task/taskUpdate';
import { taskDelete } from './operations/task/taskDelete';
import { documentFetch } from './operations/document/documentFetch';
import { documentSearch } from './operations/document/documentSearch';
import { dailyNoteSearch } from './operations/dailyNote/dailyNoteSearch';
import { dailyNoteBlockSearch } from './operations/dailyNote/dailyNoteBlockSearch';

const resolveCollectionOptions = async (
	context: ILoadOptionsFunctions,
): Promise<{ options: INodePropertyOptions[]; missingDocument: boolean }> => {
	const credential = await context.getCredentials('craftApi').catch(() => null);

	if (!credential) return { options: [], missingDocument: true };

	const documentId = (credential.documentId as string)?.trim();
	if (!documentId) return { options: [], missingDocument: true };

	let response: unknown;
	try {
		response = await craftApiRequest({
			_this: context,
			credential,
			documentId,
			method: 'GET',
			endpoint: '/collections',
			body: {},
			qs: {},
			headers: {},
			json: true,
		});
	} catch {
		return { options: [], missingDocument: false };
	}

	const toCollectionArray = (payload: unknown): IDataObject[] => {
		if (Array.isArray(payload)) return payload as IDataObject[];
		if (payload && typeof payload === 'object') {
			const root = payload as IDataObject;
			if (Array.isArray(root.items)) return root.items as IDataObject[];
			if (Array.isArray(root.collections)) return root.collections as IDataObject[];
		}
		return [];
	};

	const getId = (collection: IDataObject): string | null => {
		const candidates = [collection.key, collection.id, collection.collectionId, collection.slug];
		for (const candidate of candidates) {
			if (typeof candidate === 'string') {
				const trimmed = candidate.trim();
				if (trimmed) return trimmed;
			}
		}
		return null;
	};

	const getName = (collection: IDataObject): string | null => {
		const schema = (collection.schema as IDataObject) ?? {};
		const candidates = [collection.name, schema.name, collection.title, collection.markdown];
		for (const candidate of candidates) {
			if (typeof candidate === 'string') {
				const trimmed = candidate.trim();
				if (trimmed) return trimmed;
			}
		}
		return null;
	};

	const collections = toCollectionArray(response);
	const options: INodePropertyOptions[] = [];
	const seen = new Set<string>();

	collections.forEach((collection) => {
		if (!collection || typeof collection !== 'object') return;
		const entry = collection as IDataObject;
		const id = getId(entry);
		if (!id || seen.has(id)) return;
		const label = getName(entry) ?? id;
		const descriptionParts: string[] = [];
		if (typeof entry.documentId === 'string' && entry.documentId.trim()) {
			descriptionParts.push(`Document ${entry.documentId.trim()}`);
		}
		if (typeof entry.dailyNoteDate === 'string' && entry.dailyNoteDate.trim()) {
			descriptionParts.push(entry.dailyNoteDate.trim());
		}
		seen.add(id);
		options.push({
			name: label,
			value: id,
			description: descriptionParts.length ? descriptionParts.join(' • ') : undefined,
		});
	});

	return { options, missingDocument: false };
};

const WRITE_OPERATIONS: Record<string, Set<string>> = {
	block: new Set(['insert', 'upload', 'update', 'delete', 'move']),
	collection: new Set(['create', 'update', 'delete']),
	task: new Set(['create', 'update', 'delete']),
	document: new Set(),
};

const getOperationCategory = (resource: string, operation: string): 'read' | 'write' => {
	if (WRITE_OPERATIONS[resource]?.has(operation)) return 'write';
	return 'read';
};

type ConnectionMode = 'document' | 'tasks';

const WRITE_ONLY_ALLOWED: Record<ConnectionMode, Record<string, Set<string>>> = {
	document: {
		block: new Set(['insert']),
		document: new Set(['fetch']),
		collection: new Set(['list', 'create']),
	},
	tasks: {
		block: new Set(['insert']),
		task: new Set(['create']),
		collection: new Set(['list', 'create']),
	},
};

const isOperationAllowed = (
	connectionType: ConnectionMode,
	permissionLevel: string,
	resource: string,
	operation: string,
): boolean => {
	if (permissionLevel === 'readWrite') return true;
	if (permissionLevel === 'read') return getOperationCategory(resource, operation) === 'read';
	if (permissionLevel === 'write') {
		const allowed = WRITE_ONLY_ALLOWED[connectionType]?.[resource];
		return allowed?.has(operation) ?? false;
	}
	return true;
};

const describeWriteOnlyAllowed = (connectionType: ConnectionMode) => {
	const entries = Object.entries(WRITE_ONLY_ALLOWED[connectionType] ?? {}).filter(
		([, ops]) => ops.size,
	);
	if (!entries.length) return 'none';
	return entries.map(([res, ops]) => `${res}: ${Array.from(ops).join(', ')}`).join('; ');
};

export class Craft implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Craft',
		name: 'craft',
		icon: {
			light: 'file:../../images/craft_logo_original.svg',
			dark: 'file:../../images/craft_logo_light.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with your Craft documents via the API',
		defaults: { name: 'Craft' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'craftApi', required: true }],
		usableAsTool: true,
		documentationUrl: 'https://docs.n8n.io/integrations/custom-nodes/',
		properties: craftProperties,
	};

	methods = {
		loadOptions: {
			async getCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const { options, missingDocument } = await resolveCollectionOptions(this);
				if (missingDocument) {
					return [
						{
							name: 'Enter a Document ID First',
							value: '',
						},
					];
				}
				if (!options.length) {
					return [
						{
							name: 'No Collections Available for This Connection',
							value: '',
						},
					];
				}
				return options;
			},
		},
		listSearch: {
			async searchCollections(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const { options } = await resolveCollectionOptions(this);
				const normalized = filter?.toLowerCase().trim();
				const filtered = normalized
					? options.filter((option) =>
							typeof option.name === 'string'
								? option.name.toLowerCase().includes(normalized)
								: false,
						)
					: options;
				const results: INodeListSearchItems[] = filtered.map((option) => ({
					name: String(option.name),
					value: String(option.value),
				}));
				return { results };
			},
		},
		resourceMapping: {
			async getMappingColumns(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
				return {
					fields: [
						{
							id: 'type',
							displayName: 'Type',
							required: true,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'options',
							options: [
								{ name: 'Text', value: 'text' },
								{ name: 'Page', value: 'page' },
								{ name: 'Image', value: 'image' },
								{ name: 'Video', value: 'video' },
								{ name: 'File', value: 'file' },
								{ name: 'Drawing', value: 'drawing' },
								{ name: 'Whiteboard', value: 'whiteboard' },
								{ name: 'Table', value: 'table' },
								{ name: 'Collection', value: 'collection' },
								{ name: 'Code', value: 'code' },
								{ name: 'Rich Link', value: 'richUrl' },
								{ name: 'Collection Item', value: 'collectionItem' },
							],
						},
						{
							id: 'id',
							displayName: 'Block ID',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'string',
						},
						{
							id: 'markdown',
							displayName: 'Markdown',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'string',
						},
						{
							id: 'textStyle',
							displayName: 'Text Style',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'options',
							options: [
								{ name: 'Body', value: 'body' },
								{ name: 'Heading 1', value: 'h1' },
								{ name: 'Heading 2', value: 'h2' },
								{ name: 'Heading 3', value: 'h3' },
								{ name: 'Heading 4', value: 'h4' },
								{ name: 'Caption', value: 'caption' },
								{ name: 'Card', value: 'card' },
								{ name: 'Page', value: 'page' },
							],
						},
						{
							id: 'textAlignment',
							displayName: 'Text Alignment',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'options',
							options: [
								{ name: 'Left', value: 'left' },
								{ name: 'Center', value: 'center' },
								{ name: 'Right', value: 'right' },
								{ name: 'Justify', value: 'justify' },
							],
						},
						{
							id: 'font',
							displayName: 'Font',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'options',
							options: [
								{ name: 'System', value: 'system' },
								{ name: 'Serif', value: 'serif' },
								{ name: 'Rounded', value: 'rounded' },
								{ name: 'Mono', value: 'mono' },
							],
						},
						{
							id: 'listStyle',
							displayName: 'List Style',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'options',
							options: [
								{ name: 'None', value: 'none' },
								{ name: 'Bullet', value: 'bullet' },
								{ name: 'Numbered', value: 'numbered' },
								{ name: 'Toggle', value: 'toggle' },
								{ name: 'Task', value: 'task' },
							],
						},
						{
							id: 'indentationLevel',
							displayName: 'Indentation Level',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'number',
						},
						{
							id: 'color',
							displayName: 'Color',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'string',
						},
						{
							id: 'url',
							displayName: 'URL',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'string',
						},
						{
							id: 'altText',
							displayName: 'Alt Text',
							required: false,
							defaultMatch: false,
							canBeUsedToMatch: false,
							display: true,
							type: 'string',
						},
					],
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credential = await this.getCredentials('craftApi');

		if (!credential) {
			throw new NodeApiError(
				this.getNode(),
				{ message: 'Craft API credential is required' },
				{ itemIndex: 0 },
			);
		}

		const documentId = (credential.documentId as string).trim();
		if (!documentId) {
			throw new NodeApiError(
				this.getNode(),
				{ message: 'Document ID is missing from the Craft API credential' },
				{ itemIndex: 0 },
			);
		}

		const connectionType: ConnectionMode =
			(credential.connectionType as string) === 'tasks' ? 'tasks' : 'document';
		const permissionLevel = (credential.permissions as string) || 'readWrite';

		for (let index = 0; index < items.length; index++) {
			try {
				const resource = this.getNodeParameter('resource', index) as string;
				const operation = this.getNodeParameter('operation', index) as string;

				if (resource === 'task' && connectionType === 'document') {
					throw new NodeApiError(
						this.getNode(),
						{
							message:
								'Tasks resource is only available for Daily Notes API credentials. Provide a Tasks/Daily Notes credential to continue.',
						},
						{ itemIndex: index },
					);
				}
				if (resource === 'document' && connectionType === 'tasks') {
					throw new NodeApiError(
						this.getNode(),
						{
							message:
								'Document resource is only available for Document API credentials. Provide a Document credential to continue.',
						},
						{ itemIndex: index },
					);
				}
				if (resource === 'dailyNote' && connectionType === 'document') {
					throw new NodeApiError(
						this.getNode(),
						{
							message:
								'Daily Note resource is only available for Daily Notes API credentials. Provide a Daily Notes credential to continue.',
						},
						{ itemIndex: index },
					);
				}

				if (!isOperationAllowed(connectionType, permissionLevel, resource, operation)) {
					let message = 'Operation blocked by credential permissions.';
					if (permissionLevel === 'read') {
						message = `The "${operation}" operation requires write permissions. Update the credential permissions or pick a read-only action.`;
					} else if (permissionLevel === 'write') {
						const allowedDescription = describeWriteOnlyAllowed(connectionType);
						message = `This credential is set as write-only. Allowed operations: ${allowedDescription}. Change credential permissions or use a different credential.`;
					}
					throw new NodeApiError(this.getNode(), { message }, { itemIndex: index });
				}

				switch (resource) {
					case 'block': {
						switch (operation) {
							case 'fetch':
								await blockFetch.call(this, index, credential, documentId, returnData);
								break;
							case 'insert':
								await blockInsert.call(this, index, credential, documentId, returnData);
								break;
							case 'upload':
								await blockUpload.call(this, index, credential, documentId, returnData);
								break;
							case 'update':
								await blockUpdate.call(this, index, credential, documentId, returnData);
								break;
							case 'delete':
								await blockDelete.call(this, index, credential, documentId, returnData);
								break;
							case 'move':
								await blockMove.call(this, index, credential, documentId, returnData);
								break;
							case 'search':
								await blockSearch.call(this, index, credential, documentId, returnData);
								break;
							case 'construct': {
								const blocks = blockConstruct.call(this, index);
								returnData.push({ blocks });
								break;
							}
							default:
								throw new NodeApiError(
									this.getNode(),
									{ message: `Unsupported block operation "${operation}".` },
									{ itemIndex: index },
								);
						}
						continue;
					}
					case 'collection': {
						switch (operation) {
							case 'list':
								await collectionList.call(this, index, credential, documentId, returnData);
								break;
							case 'getSchema':
								await collectionGetSchema.call(this, index, credential, documentId, returnData);
								break;
							case 'listCollections':
								await collectionListCollections.call(
									this,
									index,
									credential,
									documentId,
									returnData,
								);
								break;
							case 'create':
								await collectionCreate.call(this, index, credential, documentId, returnData);
								break;
							case 'update':
								await collectionUpdate.call(this, index, credential, documentId, returnData);
								break;
							case 'delete':
								await collectionDelete.call(this, index, credential, documentId, returnData);
								break;
							default:
								throw new NodeApiError(
									this.getNode(),
									{ message: `Unsupported collection operation "${operation}".` },
									{ itemIndex: index },
								);
						}
						continue;
					}
					case 'task': {
						switch (operation) {
							case 'list':
								await taskList.call(this, index, credential, documentId, returnData);
								break;
							case 'create':
								await taskCreate.call(this, index, credential, documentId, returnData);
								break;
							case 'update':
								await taskUpdate.call(this, index, credential, documentId, returnData);
								break;
							case 'delete':
								await taskDelete.call(this, index, credential, documentId, returnData);
								break;
							default:
								throw new NodeApiError(
									this.getNode(),
									{ message: `Unsupported task operation "${operation}".` },
									{ itemIndex: index },
								);
						}
						continue;
					}
					case 'document': {
						switch (operation) {
							case 'fetch':
								await documentFetch.call(this, index, credential, documentId, returnData);
								break;
							case 'search':
								await documentSearch.call(this, index, credential, documentId, returnData);
								break;
							default:
								throw new NodeApiError(
									this.getNode(),
									{ message: `Unsupported document operation "${operation}".` },
									{ itemIndex: index },
								);
						}
						continue;
					}
					case 'dailyNote': {
						switch (operation) {
							case 'search':
								await dailyNoteSearch.call(this, index, credential, documentId, returnData);
								break;
							case 'searchBlocks':
								await dailyNoteBlockSearch.call(this, index, credential, documentId, returnData);
								break;
							default:
								throw new NodeApiError(
									this.getNode(),
									{ message: `Unsupported daily note operation "${operation}".` },
									{ itemIndex: index },
								);
						}
						continue;
					}
					default:
						throw new NodeApiError(
							this.getNode(),
							{ message: `Unsupported resource "${resource}".` },
							{ itemIndex: index },
						);
				}
			} catch (error) {
				throw new NodeApiError(this.getNode(), error, { itemIndex: index });
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
