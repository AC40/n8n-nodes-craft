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

export async function taskUpdate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	baseUrl: string,
	returnData: IDataObject[],
): Promise<void> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const optionsParam = this.getNodeParameter('taskUpdateOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};

	const taskInfo: IDataObject = {};
	if (options.state) taskInfo.state = options.state;
	const scheduleDate = normalizeDateInput(options.scheduleDate);
	const deadlineDate = normalizeDateInput(options.deadlineDate);
	if (scheduleDate) taskInfo.scheduleDate = scheduleDate;
	if (deadlineDate) taskInfo.deadlineDate = deadlineDate;

	const body: IDataObject = {
		tasksToUpdate: [
			{
				id: taskId,
				markdown: options.markdown,
				taskInfo: Object.keys(taskInfo).length ? taskInfo : undefined,
			},
		],
	};

	const response = await craftApiRequest({
		_this: this,
		credential,
		baseUrl,
		method: 'PUT',
		endpoint: '/tasks',
		body,
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

