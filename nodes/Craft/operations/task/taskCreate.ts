import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { craftApiRequest, parseParameter, pushResult } from '../../helpers';

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
	if (options.scheduleDate) taskInfo.scheduleDate = options.scheduleDate;
	if (options.deadlineDate) taskInfo.deadlineDate = options.deadlineDate;

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

