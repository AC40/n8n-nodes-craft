import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

const normalizeDateInput = (value: unknown): string | undefined => {
	if (!value) return undefined;
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) return undefined;
		return value.toISOString().slice(0, 10);
	}
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) return undefined;
		const match = trimmed.match(/^\d{4}-\d{2}-\d{2}/);
		return match ? match[0] : trimmed;
	}
	return undefined;
};

export async function taskCreate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const markdown = this.getNodeParameter('taskMarkdown', index) as string;
	const location = this.getNodeParameter('taskLocation', index, 'inbox') as string;
	const optionsParam = this.getNodeParameter('taskCreateOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};

	const taskInfo: IDataObject = {};
	const scheduleDate = normalizeDateInput(options.scheduleDate);
	const deadlineDate = normalizeDateInput(options.deadlineDate);
	if (scheduleDate) taskInfo.scheduleDate = scheduleDate;
	if (deadlineDate) taskInfo.deadlineDate = deadlineDate;

	const body: IDataObject = {
		tasks: [
			{
				markdown,
				taskInfo: Object.keys(taskInfo).length ? taskInfo : undefined,
				location: { type: location },
			},
		],
	};

	const response = await craftApiRequest({
		_this: this,
		credential,
		documentId,
		method: 'POST',
		endpoint: '/tasks',
		body,
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}
