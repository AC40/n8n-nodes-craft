import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftProperties } from './descriptions';
import {
	craftApiRequest,
	detectMimeType,
	ensureArray,
	parseParameter,
	pushResult,
} from './helpers';

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
		credentials: [{ name: 'craftApi', required: false }],
		usableAsTool: true,
		documentationUrl: 'https://docs.n8n.io/integrations/custom-nodes/',
		properties: craftProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credential = await this.getCredentials('craftApi').catch(() => null);

		for (let index = 0; index < items.length; index++) {
			try {
				const resource = this.getNodeParameter('resource', index) as string;
				if (resource !== 'block') continue;
				const operation = this.getNodeParameter('operation', index) as string;
				const documentId = this.getNodeParameter('documentId', index) as string;

				if (operation === 'fetch') {
					const blockId = this.getNodeParameter('blockId', index, '') as string;
					const optionsParam = this.getNodeParameter('fetchOptions', index, {});
					const options = parseParameter<IDataObject>(optionsParam);

					const outputFormat = (options?.outputFormat as string) || 'json';
					const maxDepth = options?.maxDepth as number;
					const fetchMetadata = options?.fetchMetadata === true;

					// Construct the query string parameters
					const qs: IDataObject = {};
					if (blockId) qs.id = blockId;
					if (maxDepth !== -1) qs.maxDepth = maxDepth;
					if (fetchMetadata) qs.fetchMetadata = true;

					const accept = outputFormat === 'markdown' ? 'text/markdown' : 'application/json';
					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'GET',
						endpoint: '/blocks',
						body: {},
						qs,
						headers: { Accept: accept },
						json: accept !== 'text/markdown',
					});
					pushResult(
						returnData,
						outputFormat === 'markdown' ? { markdown: response as string } : response,
					);
					continue;
				}

				if (operation === 'insert') {
					const blocksParam = this.getNodeParameter('blocks', index);
					const blocks = parseParameter<IDataObject[]>(blocksParam) ?? [];

					const positionParam = this.getNodeParameter('insertPosition', index, {});
					const position = parseParameter<IDataObject>(positionParam) ?? {};

					const type = (position.type as string) || 'end';

					const bodyPosition: IDataObject = {
						position: type,
					};
					if ((type === 'end' || type === 'start') && position.pageId) {
						bodyPosition.pageId = position.pageId;
					} else if ((type === 'before' || type === 'after') && position.siblingId) {
						bodyPosition.siblingId = position.siblingId;
					}

					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'POST',
						endpoint: '/blocks',
						body: {
							blocks,
							position: bodyPosition,
						},
						qs: {},
						headers: {},
						json: true,
					});
					pushResult(returnData, response);
					continue;
				}

				if (operation === 'upload') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
					const binaryData = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

					if (!binaryData) {
						throw new NodeApiError(
							this.getNode(),
							{
								message: `Binary property "${binaryPropertyName}" does not exist on item ${index}.`,
							},
							{ itemIndex: index },
						);
					}

					const overrideFileName = this.getNodeParameter('uploadFileName', index, '') as string;
					const overrideMimeType = this.getNodeParameter('uploadMimeType', index, '') as string;
					const blockOptions = this.getNodeParameter(
						'uploadBlockOptions',
						index,
						{},
					) as IDataObject;
					const position = this.getNodeParameter('uploadPosition', index, {}) as IDataObject;

					const items = this.getInputData();
					const binaryMetadata = items[index].binary?.[binaryPropertyName];

					const fileName =
						overrideFileName || binaryMetadata?.fileName || `craft-upload-${Date.now()}`;
					const metadataMimeType =
						typeof binaryMetadata?.mimeType === 'string' ? binaryMetadata.mimeType : '';
					const mimeType =
						overrideMimeType || metadataMimeType || detectMimeType(binaryData, fileName);
					const uploadLink = (await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'POST',
						endpoint: '/upload-link',
						body: {
							fileName,
							mimeType,
						},
						qs: {},
						headers: {},
						json: true,
					})) as IDataObject;

					const uploadUrl = uploadLink.uploadUrl as string | undefined;
					const rawUrl = uploadLink.rawUrl as string | undefined;
					const uploadMethod = (uploadLink.method as IHttpRequestMethods | undefined) || 'PUT';

					if (!uploadUrl || !rawUrl) {
						throw new NodeApiError(
							this.getNode(),
							{ message: 'Craft upload-link response did not contain the expected URLs.' },
							{ itemIndex: index },
						);
					}

					const uploadResponse = await this.helpers.httpRequest({
						method: uploadMethod,
						url: uploadUrl,
						headers: {
							'Content-Type': mimeType,
							'Content-Length': binaryData.byteLength.toString(),
						},
						body: binaryData,
						json: false,
					});

					console.log('uploadResponse', uploadResponse);

					const blockType = (blockOptions.blockType as string) || 'file';
					const blockPayload: IDataObject = {
						type: blockType,
						url: rawUrl,
					};
					if (fileName) blockPayload.fileName = fileName;
					if (blockType !== 'file' && blockOptions.altText)
						blockPayload.altText = blockOptions.altText;
					if (blockType !== 'file' && blockOptions.width) blockPayload.width = blockOptions.width;

					const positionType = (position.type as string) || 'end';
					const positionPayload: IDataObject = { position: positionType };
					if (positionType === 'end') {
						if (position.pageId) {
							positionPayload.pageId = position.pageId as string;
						}
					} else {
						if (position.siblingId) {
							positionPayload.siblingId = position.siblingId as string;
						}
					}

					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'POST',
						endpoint: '/blocks',
						body: {
							blocks: [blockPayload],
							position: positionPayload,
						},
						qs: {},
						headers: {},
						json: true,
					});
					pushResult(returnData, response);
					continue;
				}

				if (operation === 'update') {
					const updatedBlocksParam = this.getNodeParameter('updatedBlocks', index);
					const updatedBlocks = parseParameter<IDataObject[]>(updatedBlocksParam) ?? [];
					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'PUT',
						endpoint: '/blocks',
						body: {
							blocks: updatedBlocks,
						},
						qs: {},
						headers: {},
						json: true,
					});
					pushResult(returnData, response);
					continue;
				}

				if (operation === 'delete') {
					const inputMode = this.getNodeParameter('deleteInputMode', index, 'form') as string;
					let ids: string[] = [];

					if (inputMode === 'json') {
						const blockIdsParam = this.getNodeParameter('blockIdsJson', index);
						const parsedIds = parseParameter<string[]>(blockIdsParam);
						ids = parsedIds || [];
					} else {
						const parameters = this.getNodeParameter('deleteParameters', index, {}) as IDataObject;
						ids = ensureArray(parameters.blockIds as string[] | string | undefined);
					}

					if (!ids.length)
						throw new NodeApiError(
							this.getNode(),
							{ message: 'Please supply at least one block ID.' },
							{ itemIndex: index },
						);
					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'DELETE',
						endpoint: '/blocks',
						body: {
							blockIds: ids,
						},
						qs: {},
						headers: {},
						json: true,
					});
					pushResult(returnData, response, 'id');
					continue;
				}

				if (operation === 'move') {
					const inputMode = this.getNodeParameter('moveInputMode', index, 'form') as string;
					let ids: string[] = [];

					if (inputMode === 'json') {
						const blockIdsParam = this.getNodeParameter('blockIdsJson', index);
						const parsedIds = parseParameter<string[]>(blockIdsParam);
						ids = parsedIds || [];
					} else {
						const blockIdsForm = this.getNodeParameter('blockIdsForm', index) as
							| string[]
							| string
							| undefined;
						ids = ensureArray(blockIdsForm);
					}

					if (!ids.length) {
						throw new NodeApiError(
							this.getNode(),
							{ message: 'Please supply at least one block ID to move.' },
							{ itemIndex: index },
						);
					}

					const positionParam = this.getNodeParameter('movePosition', index, {}) as IDataObject;
					const position = parseParameter<IDataObject>(positionParam) ?? {};
					const type = (position.type as string) || 'end';

					const bodyPosition: IDataObject = {
						position: type,
					};
					if ((type === 'end' || type === 'start') && position.pageId) {
						bodyPosition.pageId = position.pageId;
					} else if ((type === 'before' || type === 'after') && position.siblingId) {
						bodyPosition.siblingId = position.siblingId;
					}

					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'PUT',
						endpoint: '/blocks/move',
						body: {
							blockIds: ids,
							position: bodyPosition,
						},
						qs: {},
						headers: {},
						json: true,
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

					const response = await craftApiRequest({
						_this: this,
						credential,
						documentId,
						method: 'GET',
						endpoint: '/blocks/search',
						body: {},
						qs,
						headers: {},
						json: true,
					});
					pushResult(returnData, response);
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
