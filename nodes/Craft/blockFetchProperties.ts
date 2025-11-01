import type { INodeProperties } from 'n8n-workflow';

const display = { resource: ['block'], operation: ['fetch'] };

export const blockFetchProperties: INodeProperties[] = [
	{
		displayName: 'Block ID',
		name: 'blockId',
		type: 'string',
		default: '',
		description: 'ID of the block to fetch. Leave empty to load the root page.',
		displayOptions: { show: display },
	},
	{
		displayName: 'Fetch Options',
		name: 'fetchOptions',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: display },
		options: [
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'Markdown', value: 'markdown' },
				],
				default: 'json',
			},
			{
				displayName: 'Max Depth',
				name: 'maxDepth',
				type: 'number',
				default: -1,
				typeOptions: { minValue: -1 },
				description: 'Maximum descendant depth. Use -1 to fetch all levels.',
			},
			{
				displayName: 'Fetch Metadata',
				name: 'fetchMetadata',
				type: 'boolean',
				default: false,
				description: 'Include metadata such as created and updated timestamps.',
			},
		],
	},
];
