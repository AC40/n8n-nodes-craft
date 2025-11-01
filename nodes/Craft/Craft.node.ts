import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftProperties } from './descriptions';
import { craftApiRequest, ensureArray, pushResult } from './helpers';

export class Craft implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Craft',
		name: 'craft',
		icon: { light: 'file:craft_logo_original.svg', dark: 'file:craft_logo_light.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with your Craft documents via the API',
		defaults: { name: 'Craft' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'CraftApi', required: false }],
		documentationUrl: 'https://docs.n8n.io/integrations/custom-nodes/',
		properties: craftProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credential = await this.getCredentials('CraftApi').catch(() => null);

		for (let index = 0; index < items.length; index++) {
			try {
				const resource = this.getNodeParameter('resource', index) as string;
				if (resource !== 'block') continue;
				const operation = this.getNodeParameter('operation', index) as string;

				if (operation === 'fetch') {
					const blockId = this.getNodeParameter('blockId', index, '') as string;
					const options = this.getNodeParameter('fetchOptions', index, {}) as IDataObject;
					const outputFormat = (options.outputFormat as string) || 'json';
					const maxDepth = (options.maxDepth as number) ?? -1;
					const fetchMetadata = !!options.fetchMetadata;
					const qs: IDataObject = {};
					if (blockId) qs.id = blockId;
					if (maxDepth !== -1) qs.maxDepth = maxDepth;
					if (fetchMetadata) qs.fetchMetadata = true;
					const accept = outputFormat === 'markdown' ? 'text/markdown' : 'application/json';
					const response = await craftApiRequest.call(
						this,
						credential,
						'GET',
						'/blocks',
						{},
						qs,
						{ Accept: accept },
						accept !== 'text/markdown',
					);
					pushResult(
						returnData,
						outputFormat === 'markdown' ? { markdown: response as string } : response,
					);
					continue;
				}

				if (operation === 'insert') {
					const blocks = this.getNodeParameter('blocks', index) as IDataObject[];
					const position = this.getNodeParameter('insertPosition', index, {}) as IDataObject;
					const type = (position.type as string) || 'end';
					const response = await craftApiRequest.call(this, credential, 'POST', '/blocks', {
						blocks,
						position: {
							position: type,
							...(type === 'end' ? { pageId: position.pageId } : { siblingId: position.siblingId }),
						},
					});
					pushResult(returnData, response);
					continue;
				}

				if (operation === 'update') {
					const updatedBlocks = this.getNodeParameter('updatedBlocks', index) as IDataObject[];
					const response = await craftApiRequest.call(this, credential, 'PUT', '/blocks', {
						blocks: updatedBlocks,
					});
					pushResult(returnData, response);
					continue;
				}

				if (operation === 'delete') {
					const parameters = this.getNodeParameter('deleteParameters', index, {}) as IDataObject;
					const ids = ensureArray(parameters.blockIds as string[] | string | undefined);
					if (!ids.length)
						throw new NodeApiError(
							this.getNode(),
							{ message: 'Please supply at least one block ID.' },
							{ itemIndex: index },
						);
					const response = await craftApiRequest.call(this, credential, 'DELETE', '/blocks', {
						blockIds: ids,
					});
					pushResult(returnData, response, 'id');
					continue;
				}

				if (operation === 'move') {
					const parameters = this.getNodeParameter('moveParameters', index, {}) as IDataObject;
					const ids = ensureArray(parameters.blockIds as string[] | string | undefined);
					if (!ids.length)
						throw new NodeApiError(
							this.getNode(),
							{ message: 'Please supply at least one block ID to move.' },
							{ itemIndex: index },
						);
					const type = (parameters.positionType as string) || 'after';
					const response = await craftApiRequest.call(this, credential, 'PUT', '/blocks/move', {
						blockIds: ids,
						position: {
							position: type,
							...(type === 'end'
								? { pageId: parameters.pageId }
								: { siblingId: parameters.siblingId }),
						},
					});
					pushResult(returnData, response, 'id');
					continue;
				}

				if (operation === 'search') {
					const pattern = this.getNodeParameter('pattern', index) as string;
					const options = this.getNodeParameter('searchOptions', index, {}) as IDataObject;
					const qs: IDataObject = { pattern };
					if (options.caseSensitive) qs.caseSensitive = true;
					if (options.beforeBlockCount) qs.beforeBlockCount = options.beforeBlockCount;
					if (options.afterBlockCount) qs.afterBlockCount = options.afterBlockCount;
					const response = await craftApiRequest.call(
						this,
						credential,
						'GET',
						'/blocks/search',
						{},
						qs,
					);
					pushResult(returnData, response);
				}
			} catch (error) {
				throw new NodeApiError(this.getNode(), error, { itemIndex: index });
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
