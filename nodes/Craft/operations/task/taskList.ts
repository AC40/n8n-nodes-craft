import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';

export async function taskList(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	const scope = this.getNodeParameter('taskScope', index) as string;

	const qs: IDataObject = { scope };

	const response = await craftApiRequest({
		_this: this,
		credential,
		baseUrl,
		method: 'GET',
		endpoint: '/tasks',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

