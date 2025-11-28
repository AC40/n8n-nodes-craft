import type { INodeProperties } from 'n8n-workflow';

const searchDisplay = { resource: ['dailyNote'], operation: ['search'] };
const blockSearchDisplay = { resource: ['dailyNote'], operation: ['searchBlocks'] };

export const dailyNoteOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['dailyNote'] } },
	default: 'search',
	options: [
		{
			name: 'Search Daily Notes',
			value: 'search',
			action: 'Search daily notes',
			description: 'Search across daily notes with optional date range filters',
		},
		{
			name: 'Search Within Daily Note',
			value: 'searchBlocks',
			action: 'Search blocks in a daily note',
			description: 'Search for blocks within a specific daily note date',
		},
	],
};

export const dailyNoteProperties: INodeProperties[] = [
	{
		displayName: 'Include Terms',
		name: 'include',
		type: 'string',
		required: true,
		default: '',
		description: 'Search terms to include in the search. Comma-separated list for multiple terms.',
		displayOptions: { show: searchDisplay },
	},
	{
		displayName: 'Date Filters',
		name: 'dailyNoteSearchOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add filter',
		displayOptions: { show: searchDisplay },
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				description: 'Start date (YYYY-MM-DD) or relative date (today, yesterday, etc.)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				description: 'End date (YYYY-MM-DD) or relative date (today, yesterday, etc.)',
			},
			{
				displayName: 'Daily Note Date',
				name: 'date',
				type: 'string',
				default: '',
				description: 'Specific daily note date (YYYY-MM-DD) to narrow the search scope',
			},
		],
	},
	{
		displayName: 'Daily Note Date',
		name: 'noteDate',
		type: 'string',
		required: true,
		default: '',
		description: 'Date of the daily note to search (YYYY-MM-DD or relative date)',
		displayOptions: { show: blockSearchDisplay },
	},
	{
		displayName: 'Pattern',
		name: 'blockPattern',
		type: 'string',
		required: true,
		default: '',
		description:
			'Pattern to search for within the daily note. Supports NodeJS regular expressions.',
		displayOptions: { show: blockSearchDisplay },
	},
	{
		displayName: 'Search Options',
		name: 'blockSearchOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: blockSearchDisplay },
		options: [
			{
				displayName: 'Case Sensitive',
				name: 'caseSensitive',
				type: 'boolean',
				default: false,
				description: 'Whether the search should be case sensitive',
			},
			{
				displayName: 'Before Block Count',
				name: 'beforeBlockCount',
				type: 'number',
				default: 5,
				description: 'Number of blocks to include before the match (default 5)',
				typeOptions: { minValue: 0 },
			},
			{
				displayName: 'After Block Count',
				name: 'afterBlockCount',
				type: 'number',
				default: 5,
				description: 'Number of blocks to include after the match (default 5)',
				typeOptions: { minValue: 0 },
			},
		],
	},
];
