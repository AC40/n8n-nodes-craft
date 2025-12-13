import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, pushResult } from '../../helpers';

export async function dailyNoteBlockSearch(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	const date = this.getNodeParameter('noteDate', index) as string;
	const pattern = this.getNodeParameter('blockPattern', index) as string;
	const options = this.getNodeParameter('blockSearchOptions', index, {}) as IDataObject;

	const qs: IDataObject = { date, pattern };
	if (options.caseSensitive) qs.caseSensitive = true;
	if (typeof options.beforeBlockCount === 'number') qs.beforeBlockCount = options.beforeBlockCount;
	if (typeof options.afterBlockCount === 'number') qs.afterBlockCount = options.afterBlockCount;

	const response = await craftApiRequest({
		_this: this,
		credential,
		baseUrl,
		method: 'GET',
		endpoint: '/blocks/search',
		body: {},
		qs,
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

