import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class GetCraftBlock implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Craft',
		name: 'getCraftBlock',
		icon: 'file:craft_logo_original.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Craft API',
		defaults: {
			name: 'Craft',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'CraftApi',
				required: false,
			},
		],
		documentationUrl: 'https://docs.n8n.io/integrations/custom-nodes/',
		requestDefaults: {
			baseURL: 'https://connect.craft.do/links/GogouBnj9Cj/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Block',
						value: 'block',
					},
				],
				default: 'block',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['block'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a block',
						description: 'Retrieve a Craft block by ID',
						routing: {
							request: {
								method: 'GET',
								url: '/blocks',
							},
						},
					},
				],
				default: 'get',
				required: true,
			},
			{
				displayName: 'Block ID',
				name: 'blockId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID of the block to fetch',
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['get'],
					},
				},
				routing: {
					request: {
						qs: {
							id: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Max Depth',
				name: 'maxDepth',
				type: 'number',
				default: -1,
				description: 'Maximum depth of descendants to fetch. Use -1 to fetch all levels.',
				typeOptions: {
					minValue: -1,
				},
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['get'],
					},
				},
				routing: {
					request: {
						qs: {
							maxDepth: '={{ $value === -1 ? undefined : $value }}',
						},
					},
				},
			},
			{
				displayName: 'Fetch Metadata',
				name: 'fetchMetadata',
				type: 'boolean',
				default: false,
				description: 'Whether to include metadata like authors and timestamps',
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['get'],
					},
				},
				routing: {
					request: {
						qs: {
							fetchMetadata: '={{ $value ? true : undefined }}',
						},
					},
				},
			},
		],
	};
}
