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

type CraftApiRequestOptions = {
	_this: IExecuteFunctions;
	credential: ICredentialDataDecryptedObject | null;
	documentId: string;
	method: IHttpRequestMethods;
	endpoint: string;
	body: IDataObject;
	qs: IDataObject;
	headers: IDataObject;
	json: boolean;
};

export async function craftApiRequest({
	// 'this' is a reserved word; use '_this' instead
	// or use destructuring alias if you want to keep 'this'
	_this,
	credential,
	documentId,
	method,
	endpoint,
	body,
	qs,
	headers,
	json,
}: CraftApiRequestOptions) {
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
		return _this.helpers.httpRequestWithAuthentication.call(_this, 'craftApi', {
			...options,
		});
	return _this.helpers.httpRequest.call(_this, options);
}

export const parseParameter = <T>(param: any): T | null => {
	if (typeof param === 'string') {
		try {
			return JSON.parse(param) as T;
		} catch (error) {
			console.error('Error parsing parameter', error);
			return null;
		}
	}
	return (param as T) || null;
};
