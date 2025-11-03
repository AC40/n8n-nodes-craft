import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, ensureArray, parseParameter, pushResult } from '../../helpers';

export async function blockMove(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const inputMode = this.getNodeParameter('moveInputMode', index, 'form') as string;
	let ids: string[] = [];

	if (inputMode === 'json') {
		const blockIdsParam = this.getNodeParameter('blockIdsJson', index);
		const parsedIds = parseParameter<string[]>(blockIdsParam);
		ids = parsedIds || [];
	} else {
		const blockIdsForm = this.getNodeParameter('blockIdsForm', index) as
			| string[]
			| string
			| undefined;
		ids = ensureArray(blockIdsForm);
	}

	if (!ids.length) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Please supply at least one block ID to move.' },
			{ itemIndex: index },
		);
	}

	const positionParam = this.getNodeParameter('movePosition', index, {}) as IDataObject;
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
		method: 'PUT',
		endpoint: '/blocks/move',
		body: {
			blockIds: ids,
			position: bodyPosition,
		},
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response, 'id');
}
