import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest } from '../../helpers';

export async function folderMove(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	try {
		const folderId = this.getNodeParameter('folderId', index) as string;
		const targetParentId = this.getNodeParameter('targetParentId', index, '') as string;
		const position = this.getNodeParameter('position', index, 'end') as string;

		const body: IDataObject = {
			folderIds: [folderId.trim()],
			position: {
				position,
			} as IDataObject,
		};

		if (targetParentId && targetParentId.trim()) {
			(body.position as IDataObject).parentId = targetParentId.trim();
		}

		const response = await craftApiRequest({
			_this: this,
			credential,
			baseUrl,
			method: 'PUT',
			endpoint: '/folders/move',
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
