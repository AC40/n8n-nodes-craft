import type { INodeProperties } from 'n8n-workflow';

const display = { resource: ['block'], operation: ['search'] };

export const blockSearchProperties: INodeProperties[] = [
	{
		displayName: 'Pattern',
		name: 'pattern',
		type: 'string',
		required: true,
		default: '',
		description: 'Search pattern using Node.js RegExp syntax.',
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
			{ displayName: 'Case Sensitive', name: 'caseSensitive', type: 'boolean', default: false },
			{
				displayName: 'Before Block Count',
				name: 'beforeBlockCount',
				type: 'number',
				default: 0,
				typeOptions: { minValue: 0 },
			},
			{
				displayName: 'After Block Count',
				name: 'afterBlockCount',
				type: 'number',
				default: 0,
				typeOptions: { minValue: 0 },
			},
		],
	},
];
