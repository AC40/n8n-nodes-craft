import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
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

	const connectionType = (credential?.connectionType as string) === 'tasks' ? 'tasks' : 'document';
	const positionParam = this.getNodeParameter('insertPosition', index, {});
	const position = parseParameter<IDataObject>(positionParam) ?? {};

	const type = (position.type as string) || 'end';

	const bodyPosition: IDataObject = {
		position: type,
	};
	const pageId = typeof position.pageId === 'string' ? position.pageId.trim() : '';
	const siblingId = typeof position.siblingId === 'string' ? position.siblingId.trim() : '';
	const date = typeof position.date === 'string' ? position.date.trim() : '';

	if (type === 'before' || type === 'after') {
		if (!siblingId) {
			throw new NodeApiError(
				this.getNode(),
				{ message: 'Please provide a sibling ID when positioning before or after a block.' },
				{ itemIndex: index },
			);
		}
		bodyPosition.siblingId = siblingId;
	} else if (type === 'start' || type === 'end') {
		if (connectionType === 'document') {
			if (!pageId) {
				throw new NodeApiError(
					this.getNode(),
					{
						message:
							'Please provide a page/document ID when inserting at the start or end using a multi-document credential.',
					},
					{ itemIndex: index },
				);
			}
			bodyPosition.pageId = pageId;
		} else {
			bodyPosition.date = date || 'today';
			if (pageId) bodyPosition.pageId = pageId;
		}
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
