import type { INodeProperties } from 'n8n-workflow';

const display = { resource: ['block'], operation: ['search'] };

export const blockSearchProperties: INodeProperties[] = [
	{
		displayName: 'Pattern',
		name: 'pattern',
		type: 'string',
		required: true,
		default: '',
		description: 'Search pattern to look for. Supports NodeJS regular expressions.',
		displayOptions: { show: display },
	},
	{
		displayName: 'Search Options',
		name: 'searchOptions',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: display },
		options: [
			{
				displayName: 'Case Sensitive',
				name: 'caseSensitive',
				description: 'Whether the search should be case sensitive',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Before Block Count',
				name: 'beforeBlockCount',
				type: 'number',
				default: 5,
				description:
					'The number of additional blocks that are returned before the matched block. Defaults to 5.',
				typeOptions: { minValue: 0 },
			},
			{
				displayName: 'After Block Count',
				name: 'afterBlockCount',
				type: 'number',
				default: 5,
				description:
					'The number of additional blocks that are returned after the matched block. Defaults to 5.',
				typeOptions: { minValue: 0 },
			},
		],
	},
];
