import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';
import { getCollectionEndpoint } from './collectionHelper';

export async function collectionList(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const { endpoint: collectionEndpoint } = getCollectionEndpoint.call(this, index);
	const optionsParam = this.getNodeParameter('collectionListOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};
	const outputFormat = (options.outputFormat as string) || 'json';
	const maxDepth = options.maxDepth as number;

	const qs: IDataObject = {};
	if (typeof maxDepth === 'number' && maxDepth !== -1) qs.maxDepth = maxDepth;

	const accept =
		outputFormat === 'markdown' ? 'application/json; content=markdown' : 'application/json';
	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'GET',
		endpoint: collectionEndpoint,
		body: {},
		qs,
		headers: { Accept: accept },
		json: true,
	});
	pushResult(returnData, response);
}
