import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest } from '../../helpers';

export async function folderList(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	try {
		const response = await craftApiRequest({
			_this: this,
			credential,
			baseUrl,
			method: 'GET',
			endpoint: '/folders',
			body: {},
			qs: {},
			headers: {},
			json: true,
		});

		returnData.push(response as IDataObject);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error, { itemIndex: index });
	}
}
