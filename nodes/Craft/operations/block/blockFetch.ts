import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

export async function blockFetch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const connectionType = (credential?.connectionType as string) === 'tasks' ? 'tasks' : 'document';
	const blockId = (this.getNodeParameter('blockId', index, '') as string).trim();
	const dailyNoteDate = (this.getNodeParameter('dailyNoteDate', index, 'today') as string).trim();
	const optionsParam = this.getNodeParameter('fetchOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam);

	const outputFormat = (options?.outputFormat as string) || 'json';
	const maxDepth = options?.maxDepth as number | undefined;
	const fetchMetadata = options?.fetchMetadata === true;

	const qs: IDataObject = {};
	if (blockId) qs.id = blockId;
	if (connectionType === 'document' && !qs.id) {
		throw new NodeApiError(
			this.getNode(),
			{
				message:
					'Please provide a Document or Block ID. Use the List Documents operation to discover IDs for multi-document connections.',
			},
			{ itemIndex: index },
		);
	}
	if (connectionType === 'tasks' && !qs.id) {
		qs.date = dailyNoteDate || 'today';
	}
	if (typeof maxDepth === 'number' && maxDepth !== -1) qs.maxDepth = maxDepth;
	if (fetchMetadata) qs.fetchMetadata = true;

	const accept = outputFormat === 'markdown' ? 'text/markdown' : 'application/json';
	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'GET',
		endpoint: '/blocks',
		body: {},
		qs,
		headers: { Accept: accept },
		json: accept !== 'text/markdown',
	});
	pushResult(returnData, outputFormat === 'markdown' ? { markdown: response as string } : response);
}
