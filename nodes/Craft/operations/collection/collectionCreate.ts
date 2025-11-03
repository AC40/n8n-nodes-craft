import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';
import { getCollectionEndpoint } from './collectionHelper';

export async function collectionCreate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const { endpoint: collectionEndpoint } = getCollectionEndpoint.call(this, index);
	const itemsParam = this.getNodeParameter('collectionItems', index);
	const items = parseParameter<IDataObject[]>(itemsParam) ?? [];
	if (!Array.isArray(items) || !items.length) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Please supply at least one item to create.' },
			{ itemIndex: index },
		);
	}
	const optionsParam = this.getNodeParameter('collectionCreateOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};
	const body: IDataObject = { items };
	if (typeof options.allowNewSelectOptions === 'boolean') {
		body.allowNewSelectOptions = options.allowNewSelectOptions;
	}

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'POST',
		endpoint: collectionEndpoint,
		body,
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
