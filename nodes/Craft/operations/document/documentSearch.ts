import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';

const normalizeCsv = (input: string | undefined): string[] =>
	input
		? input
				.split(',')
				.map((entry) => entry.trim())
				.filter(Boolean)
		: [];

export async function documentSearch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	const includeRaw = this.getNodeParameter('documentInclude', index) as string;
	const options = this.getNodeParameter('documentSearchOptions', index, {}) as IDataObject;

	const includeTerms = normalizeCsv(includeRaw);
	if (!includeTerms.length) {
		throw new Error('At least one include term is required');
	}

	const qs: IDataObject = includeTerms.length === 1 ? { include: includeTerms[0] } : { include: includeTerms };

	const documentIds = normalizeCsv(options.documentIds as string | undefined);
	if (documentIds.length === 1) qs.documentIds = documentIds[0];
	else if (documentIds.length > 1) qs.documentIds = documentIds;

	if (documentIds.length) {
		const filterMode = (options.documentFilterMode as string) || 'include';
		qs.documentFilterMode = filterMode;
	}

	const response = await craftApiRequest({
		_this: this,
		credential,
		baseUrl,
		method: 'GET',
		endpoint: '/documents/search',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

