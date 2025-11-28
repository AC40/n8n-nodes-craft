import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

export async function taskUpdate(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): Promise<void> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const optionsParam = this.getNodeParameter('taskUpdateOptions', index, {});
	const options = parseParameter<IDataObject>(optionsParam) ?? {};

	const taskInfo: IDataObject = {};
	if (options.state) taskInfo.state = options.state;
	if (options.scheduleDate) taskInfo.scheduleDate = options.scheduleDate;
	if (options.deadlineDate) taskInfo.deadlineDate = options.deadlineDate;

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
		documentId,
		method: 'PUT',
		endpoint: '/tasks',
		body,
		qs: {},
		headers: {},
		json: true,
	});
	pushResult(returnData, response);
}

