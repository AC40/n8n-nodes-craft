import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: {
		resource: ['collection'],
		operation: Array.isArray(operation) ? operation : [operation],
	},
});

export const collectionOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['collection'] } },
	default: 'list',
	options: [
		{
			name: 'List Items',
			value: 'list',
			action: 'List collection items',
			description: 'Retrieve collection items',
		},
		{
			name: 'Get Collection Schema',
			value: 'getSchema',
			action: 'Get collection schema',
			description: 'Retrieve a collection schema in the desired format',
		},
		{
			name: 'Create Items',
			value: 'create',
			action: 'Create collection items',
			description: 'Insert new items into a collection',
		},
		{
			name: 'Update Items',
			value: 'update',
			action: 'Update collection items',
			description: 'Modify existing items in a collection',
		},
		{
			name: 'Delete Items',
			value: 'delete',
			action: 'Delete collection items',
			description: 'Remove items from a collection',
		},
		{
			name: 'List Collections',
			value: 'listCollections',
			action: 'List collections',
			description: 'Retrieve available collections and their metadata',
		},
	],
};

export const collectionProperties: INodeProperties[] = [
	{
		displayName: 'Collection',
		name: 'collectionLocator',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select or enter the collection ID returned by the GET /collections endpoint',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['list', 'create', 'update', 'delete', 'getSchema'],
			},
		},
		modes: [
			{
				displayName: 'Collection',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchCollections',
					searchFilterRequired: false,
				},
				placeholder: 'Select a collection...',
			},
			{
				displayName: 'Manual',
				name: 'id',
				type: 'string',
				placeholder: 'col-123 (collection ID)',
			},
		],
	},
	{
		displayName: 'List Options',
		name: 'collectionListOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('list'),
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
				description: 'Choose the response format. Markdown adds contentMarkdown to each item.',
			},
			{
				displayName: 'Max Depth',
				name: 'maxDepth',
				type: 'number',
				default: -1,
				typeOptions: { minValue: -1 },
				description: 'Maximum depth of nested blocks to retrieve. Use -1 to fetch all.',
			},
		],
	},
	{
		displayName: 'Items',
		name: 'collectionItems',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of items to create. Example: [{"title":"Example","properties":{ ... }}]',
		displayOptions: show('create'),
	},
	{
		displayName: 'Create Options',
		name: 'collectionCreateOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('create'),
		options: [
			{
				displayName: 'Allow New Select Options',
				name: 'allowNewSelectOptions',
				type: 'boolean',
				default: false,
				description:
					'Whether to permit Craft to auto-create new select options present in the payload',
			},
		],
	},
	{
		displayName: 'Items to Update',
		name: 'collectionItemsToUpdate',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of items with ID to update. Example: [{"ID":"1","properties": { ... }}]',
		displayOptions: show('update'),
	},
	{
		displayName: 'Update Options',
		name: 'collectionUpdateOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('update'),
		options: [
			{
				displayName: 'Allow New Select Options',
				name: 'allowNewSelectOptions',
				type: 'boolean',
				default: false,
				description:
					'Whether to permit Craft to auto-create new select options present in the payload',
			},
		],
	},
	{
		displayName: 'IDs to Delete',
		name: 'collectionIdsToDelete',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of collection item IDs to delete. Example: ["1","2"].',
		displayOptions: show('delete'),
	},
	{
		displayName: 'Schema Options',
		name: 'collectionSchemaOptions',
		type: 'collection',
		default: { format: 'json-schema-items' },
		placeholder: 'Add option',
		displayOptions: show('getSchema'),
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				default: 'json-schema-items',
				options: [
					{ name: 'JSON Schema Items', value: 'json-schema-items' },
					{ name: 'Schema Structure', value: 'schema' },
				],
				description:
					"'json-schema-items' returns validation schema for items (default). 'schema' returns editable schema structure.",
			},
		],
	},
	{
		displayName: 'List Collections Options',
		name: 'collectionListCollectionsOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('listCollections'),
		options: [
			{
				displayName: 'Document IDs',
				name: 'documentIds',
				type: 'string',
				default: '',
				description:
					'Comma-separated document IDs to include or exclude. Leave empty to list all accessible collections.',
			},
			{
				displayName: 'Document Filter Mode',
				name: 'documentFilterMode',
				type: 'options',
				default: 'include',
				options: [
					{ name: 'Include', value: 'include' },
					{ name: 'Exclude', value: 'exclude' },
				],
				description: 'Whether to include or exclude the supplied document IDs.',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				description:
					'Daily Notes credentials only. Filter collections in notes on or after this date (YYYY-MM-DD or relative date).',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				description:
					'Daily Notes credentials only. Filter collections in notes on or before this date (YYYY-MM-DD or relative date).',
			},
		],
	},
];
