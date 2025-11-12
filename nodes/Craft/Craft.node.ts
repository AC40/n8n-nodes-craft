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
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftProperties } from './descriptions';
import { craftApiRequest, toCollectionSlug } from './helpers';
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
import { collectionUpdate } from './operations/collection/collectionUpdate';
import { blockConstruct } from './operations/block/blockConstruct';

const resolveCollectionOptions = async (
	context: ILoadOptionsFunctions,
): Promise<{ options: INodePropertyOptions[]; missingDocument: boolean }> => {
	let documentId = '';
	try {
		documentId = (context.getNodeParameter('documentId', 0) as string) || '';
	} catch {
		return { options: [], missingDocument: true };
	}
	documentId = documentId.trim();
	if (!documentId) return { options: [], missingDocument: true };

	const credential = await context.getCredentials('craftApi').catch(() => null);

	let response: unknown;
	try {
		response = await craftApiRequest({
			_this: context,
			credential,
			documentId,
			method: 'GET',
			endpoint: '/blocks',
			body: {},
			qs: {},
			headers: {},
			json: true,
		});
	} catch (error) {
		console.warn('Failed to fetch Craft collections', error);
		return { options: [], missingDocument: false };
	}

	const options: INodePropertyOptions[] = [];
	const seen = new Set<string>();

	const upsertOption = (name: string) => {
		const trimmed = name.trim();
		const slug = toCollectionSlug(trimmed);
		if (!trimmed || !slug || seen.has(slug)) return;
		seen.add(slug);
		options.push({ name: trimmed, value: slug });
	};

	const walk = (nodes: unknown): void => {
		if (!Array.isArray(nodes)) return;
		nodes.forEach((entry) => {
			if (!entry || typeof entry !== 'object') return;
			const block = entry as IDataObject;
			if ((block.type as string) === 'collection' && typeof block.markdown === 'string') {
				upsertOption(block.markdown);
			}
			if (Array.isArray(block.content)) walk(block.content as IDataObject[]);
		});
	};

	if (Array.isArray(response)) walk(response as IDataObject[]);
	else if (response && typeof response === 'object') {
		const root = response as IDataObject;
		if (Array.isArray(root.content)) walk(root.content as IDataObject[]);
	}

	return { options, missingDocument: false };
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
		credentials: [{ name: 'craftApi', required: false }],
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
							name: 'No Collections Detected in Document',
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
			async getMappingColumns(this: ILoadOptionsFunctions): Promise<{ fields: any[] }> {
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
		const credential = await this.getCredentials('craftApi').catch(() => null);

		for (let index = 0; index < items.length; index++) {
			try {
				const resource = this.getNodeParameter('resource', index) as string;
				const operation = this.getNodeParameter('operation', index) as string;
				const documentId = this.getNodeParameter('documentId', index) as string;

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
							case 'construct':
								const blocks = blockConstruct.call(this, index, credential, documentId, returnData);
								returnData.push({ blocks });
								break;
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
					default:
						throw new NodeApiError(
							this.getNode(),
							{ message: `Unsupported resource "${resource}".` },
							{ itemIndex: index },
						);
				}
			} catch (error) {
				console.error('error', error);
				console.error('index', index);
				throw new NodeApiError(this.getNode(), error, { itemIndex: index });
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
