import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CraftApi implements ICredentialType {
	name = 'craftApi';

	displayName = 'Craft API';

	icon: Icon = {
		light: 'file:..//icons/craft_logo_original.svg',
		dark: 'file:..//icons/craft_logo_light.svg',
	};

	documentationUrl = 'https://ac-rich.craft.me/1qjRHwQqnPzlaV';

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
			required: true,
			description:
				'The ID of the document to which this API Key belongs. Usually an 11-character string between "https://connect.craft.do/link/" and "/docs/v1".',
			placeholder: 'The API identifier of this document',
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
