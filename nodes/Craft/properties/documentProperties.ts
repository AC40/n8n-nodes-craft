import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: {
		resource: ['document'],
		operation: Array.isArray(operation) ? operation : [operation],
	},
});

export const documentOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['document'] } },
	default: 'fetch',
	options: [
		{
			name: 'List Documents',
			value: 'fetch',
			action: 'Fetch documents',
			description: 'Retrieve available Craft documents',
		},
		{
			name: 'Search Documents',
			value: 'search',
			action: 'Search documents',
			description: 'Search across documents with include terms and optional filters',
		},
	],
};

export const documentProperties: INodeProperties[] = [
	{
		displayName: 'Fetch Options',
		name: 'documentFetchOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('fetch'),
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				description: 'Filter documents updated after this date (YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				description: 'Filter documents updated before this date (YYYY-MM-DD)',
			},
		],
	},
	{
		displayName: 'Include Terms',
		name: 'documentInclude',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated search terms to include in the search.',
		displayOptions: show('search'),
	},
	{
		displayName: 'Search Options',
		name: 'documentSearchOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('search'),
		options: [
			{
				displayName: 'Document IDs',
				name: 'documentIds',
				type: 'string',
				default: '',
				description: 'Comma-separated document IDs to include or exclude from the search.',
			},
			{
				displayName: 'Filter Mode',
				name: 'documentFilterMode',
				type: 'options',
				default: 'include',
				options: [
					{ name: 'Include', value: 'include' },
					{ name: 'Exclude', value: 'exclude' },
				],
				description: 'Whether to include or exclude the listed document IDs.',
			},
		],
	},
];

