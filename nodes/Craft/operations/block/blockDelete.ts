import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, ensureArray, parseParameter, pushResult } from '../../helpers';

export async function blockDelete(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
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
}
