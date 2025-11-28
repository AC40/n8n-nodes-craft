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
];

