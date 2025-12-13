import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';

const normalizeInclude = (input: string): string[] =>
	input
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);

export async function dailyNoteSearch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	const includeRaw = this.getNodeParameter('include', index) as string;
	const options = this.getNodeParameter('dailyNoteSearchOptions', index, {}) as IDataObject;

	const qs: IDataObject = {};
	const includeTerms = normalizeInclude(includeRaw);
	if (includeTerms.length === 1) {
		qs.include = includeTerms[0];
	} else if (includeTerms.length > 1) {
		qs.include = includeTerms;
	}

	if (options.startDate) qs.startDate = options.startDate;
	if (options.endDate) qs.endDate = options.endDate;

	const response = await craftApiRequest({
		_this: this,
		credential,
		baseUrl,
		method: 'GET',
		endpoint: '/daily-notes/search',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
