import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, ensureArray, parseParameter, pushResult } from '../../helpers';

export async function blockMove(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
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

	const connectionType = (credential?.connectionType as string) === 'tasks' ? 'tasks' : 'document';
	const positionParam = this.getNodeParameter('movePosition', index, {}) as IDataObject;
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
				{ message: 'Please provide a sibling ID when moving before or after a block.' },
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
							'Please provide a page/document ID when moving to the start or end using a multi-document credential.',
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
		baseUrl,
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
