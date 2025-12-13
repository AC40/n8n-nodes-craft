import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest } from '../../helpers';

export async function folderCreate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	try {
		const name = this.getNodeParameter('name', index) as string;
		const parentId = this.getNodeParameter('parentId', index, '') as string;

		const body: IDataObject = {
			name: name.trim(),
		};

		if (parentId && parentId.trim()) {
			body.parentId = parentId.trim();
		}

		const response = await craftApiRequest({
			_this: this,
			credential,
			baseUrl,
			method: 'POST',
			endpoint: '/folders',
			body,
			qs: {},
			headers: {},
			json: true,
		});

		returnData.push(response as IDataObject);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error, { itemIndex: index });
	}
}
