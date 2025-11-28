import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, ensureArray, pushResult } from '../../helpers';

export async function taskDelete(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const taskIds = this.getNodeParameter('taskIds', index) as string | string[];
	const idsToDelete = ensureArray(taskIds);

	const body: IDataObject = { idsToDelete };

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'DELETE',
		endpoint: '/tasks',
		body,
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

