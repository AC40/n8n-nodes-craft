import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

export async function documentFetch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const optionsParam = this.getNodeParameter('documentFetchOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};

	const qs: IDataObject = {};
	if (options.startDate) qs.startDate = options.startDate;
	if (options.endDate) qs.endDate = options.endDate;

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'GET',
		endpoint: '/documents',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

