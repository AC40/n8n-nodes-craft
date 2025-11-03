import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

export async function blockInsert(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const blocksParam = this.getNodeParameter('blocks', index);
	const blocks = parseParameter<IDataObject[]>(blocksParam) ?? [];

	const positionParam = this.getNodeParameter('insertPosition', index, {});
	const position = parseParameter<IDataObject>(positionParam) ?? {};

	const type = (position.type as string) || 'end';

	const bodyPosition: IDataObject = {
		position: type,
	};
	if ((type === 'end' || type === 'start') && position.pageId) {
		bodyPosition.pageId = position.pageId;
	} else if ((type === 'before' || type === 'after') && position.siblingId) {
		bodyPosition.siblingId = position.siblingId;
	}

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'POST',
		endpoint: '/blocks',
		body: {
			blocks,
			position: bodyPosition,
		},
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
