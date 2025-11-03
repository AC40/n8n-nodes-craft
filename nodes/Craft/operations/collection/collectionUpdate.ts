import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';
import { getCollectionEndpoint } from './collectionHelper';

export async function collectionUpdate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const { endpoint: collectionEndpoint } = getCollectionEndpoint.call(this, index);
	const itemsParam = this.getNodeParameter('collectionItemsToUpdate', index);
	const itemsToUpdate = parseParameter<IDataObject[]>(itemsParam) ?? [];
	if (!Array.isArray(itemsToUpdate) || !itemsToUpdate.length) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Please supply at least one item to update.' },
			{ itemIndex: index },
		);
	}
	const optionsParam = this.getNodeParameter('collectionUpdateOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};
	const body: IDataObject = {
		itemsToUpdate,
	};
	if (typeof options.allowNewSelectOptions === 'boolean') {
		body.allowNewSelectOptions = options.allowNewSelectOptions;
	}

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'PUT',
		endpoint: collectionEndpoint,
		body,
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
