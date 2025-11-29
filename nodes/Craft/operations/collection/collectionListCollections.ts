import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';

const normalizeCsv = (value: string | undefined): string[] =>
	value
		? value
				.split(',')
				.map((entry) => entry.trim())
				.filter(Boolean)
		: [];

export async function collectionListCollections(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const options = this.getNodeParameter('collectionListCollectionsOptions', index, {}) as IDataObject;

	const qs: IDataObject = {};

	const documentIds = normalizeCsv(options.documentIds as string | undefined);
	if (documentIds.length === 1) qs.documentIds = documentIds[0];
	else if (documentIds.length > 1) qs.documentIds = documentIds;

	if (documentIds.length) {
		qs.documentFilterMode = (options.documentFilterMode as string) || 'include';
	}

	if (options.startDate) qs.startDate = options.startDate;
	if (options.endDate) qs.endDate = options.endDate;

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'GET',
		endpoint: '/collections',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

