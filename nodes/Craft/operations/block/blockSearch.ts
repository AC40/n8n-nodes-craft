import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';

export async function blockSearch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const documentIdFilter = (this.getNodeParameter('searchDocumentId', index) as string).trim();
	if (!documentIdFilter) {
		throw new NodeApiError(
			this.getNode(),
			{
				message:
					'Please provide a document ID to search. Use the List Documents operation to discover IDs.',
			},
			{ itemIndex: index },
		);
	}
	const pattern = this.getNodeParameter('pattern', index) as string;
	const options = this.getNodeParameter('searchOptions', index, {}) as IDataObject;

	const qs: IDataObject = { pattern, documentId: documentIdFilter };

	if (options.caseSensitive) qs.caseSensitive = true;
	if (options.beforeBlockCount) qs.beforeBlockCount = options.beforeBlockCount;
	if (options.afterBlockCount) qs.afterBlockCount = options.afterBlockCount;

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'GET',
		endpoint: '/blocks/search',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
