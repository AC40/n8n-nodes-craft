import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CraftAPI implements ICredentialType {
	name = 'craftApi';

	displayName = 'Craft API';

	icon: Icon = { light: 'file:craft_logo_original.svg', dark: 'file:craft_logo_light.svg' };

	//TODO: create personal craft doc to explain
	documentationUrl = '';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: { password: true },
		},
		{
			displayName: 'Document ID',
			name: 'documentId',
			type: 'string',
			default: '',
			required: false,
			description:
				'The ID of the document to work with. Usually an 11-character string between "https://connect.craft.do/link/" and "/docs/v1". Optional, only used to test connection. Credential will work without it.',
			placeholder: 'Optional, only used to test connection',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{`Bearer ${$credentials.apiKey}`}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{`https://connect.craft.do/links/${$credentials.documentId}/api/v1`}}',
			url: '/blocks',
			method: 'GET',
		},
	};
}
