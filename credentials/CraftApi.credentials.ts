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
		light: 'file:..//images/craft_logo_original.svg',
		dark: 'file:..//images/craft_logo_light.svg',
	};

	documentationUrl = 'https://ac-rich.craft.me/1qjRHwQqnPzlaV';

	properties: INodeProperties[] = [
		{
			displayName: 'Connection Type',
			name: 'connectionType',
			type: 'options',
			default: 'document',
			description: 'Choose which Craft API this credential targets',
			options: [
				{ name: 'Document API', value: 'document' },
				{ name: 'Daily Notes & Tasks API', value: 'tasks' },
			],
		},
		{
			displayName: 'Permissions',
			name: 'permissions',
			type: 'options',
			default: 'readWrite',
			description: 'Permissions granted to this credential',
			options: [
				{ name: 'Read Only', value: 'read' },
				{ name: 'Read + Write', value: 'readWrite' },
				{ name: 'Write Only', value: 'write' },
			],
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: false,
			description:
				'Optional for public documents; required for private documents and Daily Notes API',
			typeOptions: { password: true },
		},
		{
			displayName: 'Connection ID',
			name: 'documentId',
			type: 'string',
			default: '',
			required: true,
			description:
				'The ID of the connection. Usually an 11-character string between. Found in the url of the connection between "https://connect.craft.do/links/" and "/api/v1.',
			placeholder: 'e.g.: BxDA9pjUDPf (found in the url of the connection)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey ? `Bearer ${$credentials.apiKey}` : undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{`https://connect.craft.do/links/${$credentials.documentId}/api/v1`}}',
			url: '/collections',
			method: 'GET',
		},
	};
}
