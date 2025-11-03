import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';
import { getCollectionEndpoint } from './collectionHelper';

export async function collectionDelete(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const { endpoint: collectionEndpoint } = getCollectionEndpoint.call(this, index);
	const idsParam = this.getNodeParameter('collectionIdsToDelete', index);
	const ids = parseParameter<string[]>(idsParam) ?? [];
	if (!Array.isArray(ids) || !ids.length) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Please supply at least one collection item ID to delete.' },
			{ itemIndex: index },
		);
	}

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'DELETE',
		endpoint: collectionEndpoint,
		body: {
			idsToDelete: ids,
		},
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response, 'id');
}
