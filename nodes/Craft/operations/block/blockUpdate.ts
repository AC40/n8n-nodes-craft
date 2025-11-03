import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

export async function blockUpdate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const updatedBlocksParam = this.getNodeParameter('updatedBlocks', index);
	const updatedBlocks = parseParameter<IDataObject[]>(updatedBlocksParam) ?? [];
	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'PUT',
		endpoint: '/blocks',
		body: {
			blocks: updatedBlocks,
		},
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
