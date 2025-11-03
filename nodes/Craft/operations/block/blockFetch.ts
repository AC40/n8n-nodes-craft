import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

export async function blockFetch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const blockId = this.getNodeParameter('blockId', index, '') as string;
	const optionsParam = this.getNodeParameter('fetchOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam);

	const outputFormat = (options?.outputFormat as string) || 'json';
	const maxDepth = options?.maxDepth as number;
	const fetchMetadata = options?.fetchMetadata === true;

	const qs: IDataObject = {};
	if (blockId) qs.id = blockId;
	if (maxDepth !== -1) qs.maxDepth = maxDepth;
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
