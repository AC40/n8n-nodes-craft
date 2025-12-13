import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';
import { getCollectionEndpoint } from './collectionHelper';

export async function collectionGetSchema(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	const { collectionId } = getCollectionEndpoint.call(this, index);
	const options = this.getNodeParameter('collectionSchemaOptions', index, {}) as IDataObject;
	const format = (options.format as string) || 'json-schema-items';

	const qs: IDataObject = {};
	if (format) qs.format = format;

	const response = await craftApiRequest({
		_this: this,
		credential,
		baseUrl,
		method: 'GET',
		endpoint: `/collections/${encodeURIComponent(collectionId)}/schema`,
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
