import type {
	ICredentialDataDecryptedObject,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

const buildBaseUrl = (documentId: string) =>
	`https://connect.craft.do/links/${encodeURIComponent(documentId)}/api/v1`;

export const ensureArray = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value : value ? [value] : [];

export const pushResult = (collector: IDataObject[], data: unknown, fallback = 'value') => {
	if (Array.isArray(data)) {
		data.forEach((entry) => pushResult(collector, entry, fallback));
		return;
	}
	if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
		collector.push({ [fallback]: data });
		return;
	}
	if (data && typeof data === 'object') {
		collector.push(data as IDataObject);
	} else {
		collector.push({});
	}
};

export async function craftApiRequest(
	this: IExecuteFunctions,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	headers: IDataObject = {},
	json = true,
) {
	const options: IHttpRequestOptions = {
		method,
		url: `${buildBaseUrl(documentId)}${endpoint}`,
		qs,
		headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...headers },
		json,
	};
	if (Object.keys(body).length) options.body = body;
	if (!json) {
		options.json = false;
		delete options.body;
		delete (options.headers as IDataObject)['Content-Type'];
	}
	if (credential)
		return this.helpers.httpRequestWithAuthentication.call(this, 'craftApi', {
			...options,
		});
	return this.helpers.httpRequest.call(this, options);
}
