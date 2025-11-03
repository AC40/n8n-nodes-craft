import type {
	ICredentialDataDecryptedObject,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, detectMimeType, pushResult } from '../../helpers';

export async function blockUpload(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
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
	const blockOptions = this.getNodeParameter('uploadBlockOptions', index, {}) as IDataObject;
	const position = this.getNodeParameter('uploadPosition', index, {}) as IDataObject;

	const items = this.getInputData();
	const binaryMetadata = items[index].binary?.[binaryPropertyName];

	const fileName = overrideFileName || binaryMetadata?.fileName || `craft-upload-${Date.now()}`;
	const metadataMimeType =
		typeof binaryMetadata?.mimeType === 'string' ? binaryMetadata.mimeType : '';
	const mimeType = overrideMimeType || metadataMimeType || detectMimeType(binaryData, fileName);
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

	await this.helpers.httpRequest({
		method: uploadMethod,
		url: uploadUrl,
		headers: {
			'Content-Type': mimeType,
			'Content-Length': binaryData.byteLength.toString(),
		},
		body: binaryData,
		json: false,
	});

	const blockType = (blockOptions.blockType as string) || 'file';
	const blockPayload: IDataObject = {
		type: blockType,
		url: rawUrl,
	};
	if (fileName) blockPayload.fileName = fileName;
	if (blockType !== 'file' && blockOptions.altText) blockPayload.altText = blockOptions.altText;
	if (blockType !== 'file' && blockOptions.width) blockPayload.width = blockOptions.width;

	const positionType = (position.type as string) || 'end';
	const positionPayload: IDataObject = { position: positionType };
	if (positionType === 'end') {
		if (position.pageId) {
			positionPayload.pageId = position.pageId as string;
		}
	} else if (position.siblingId) {
		positionPayload.siblingId = position.siblingId as string;
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
}
