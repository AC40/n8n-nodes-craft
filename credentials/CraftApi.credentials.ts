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
			default: 'multiDocument',
			description: 'Choose which Craft API connection type this credential targets',
			options: [
				{
					name: 'Multi-Document Connection',
					value: 'multiDocument',
					description: 'Access to multiple selected documents',
				},
				{
					name: 'Daily Notes Connection',
					value: 'dailyNotes',
					description: 'Access to daily notes with tasks and collections',
				},
				{
					name: 'Full Space Connection',
					value: 'fullSpace',
					description: 'Access to all documents and folders in the space',
				},
				// Legacy options for backwards compatibility
				{
					name: 'Document API (Legacy)',
					value: 'document',
					description: 'Legacy document connection - use Multi-Document instead',
				},
				{
					name: 'Daily Notes & Tasks API (Legacy)',
					value: 'tasks',
					description: 'Legacy tasks connection - use Daily Notes instead',
				},
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
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			required: true,
			description:
				'The full base URL of your Craft API connection. Copy this from your Craft API settings, it should end with "/api/v1".',
			placeholder: 'e.g.: https://connect.craft.do/links/EUs9dtqt7we/api/v1',
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
			baseURL: '={{$credentials.baseUrl}}',
			url: '={{ $credentials.connectionType === "dailyNotes" ? "/blocks?date=today" : ($credentials.connectionType === "fullSpace" ? "/folders" : "/documents") }}',
			method: 'GET',
		},
	};
}
