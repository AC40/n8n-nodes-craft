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
			description: 'Retrieve collection entries via GET /collections/{collectionName}/items',
		},
		{
			name: 'Create Items',
			value: 'create',
			action: 'Create collection items',
			description: 'Insert new items via POST /collections/{collectionName}/items',
		},
		{
			name: 'Update Items',
			value: 'update',
			action: 'Update collection items',
			description: 'Modify existing items via PUT /collections/{collectionName}/items',
		},
		{
			name: 'Delete Items',
			value: 'delete',
			action: 'Delete collection items',
			description: 'Remove items via DELETE /collections/{collectionName}/items',
		},
	],
};

export const collectionProperties: INodeProperties[] = [
	{
		displayName: 'Collection Source',
		name: 'collectionInputMode',
		type: 'options',
		default: 'select',
		description: 'Choose how to target a collection',
		displayOptions: { show: { resource: ['collection'] } },
		options: [
			{ name: 'Select from Document', value: 'select' },
			{ name: 'Enter Manually', value: 'manual' },
		],
	},
	{
		displayName: 'Collection Name',
		name: 'collectionName',
		type: 'options',
		default: '',
		required: true,
		description: 'Pick a collection detected in the document',
		displayOptions: {
			show: { resource: ['collection'], collectionInputMode: ['select'] },
		},
		typeOptions: {
			loadOptionsMethod: 'getCollections',
			loadOptionsDependsOn: ['documentId'],
		},
		options: [],
	},
	{
		displayName: 'Collection Name',
		name: 'collectionNameManual',
		type: 'string',
		default: '',
		required: true,
		description: 'API identifier of the collection (e.g. "test_collection"). Case-sensitive.',
		displayOptions: {
			show: { resource: ['collection'], collectionInputMode: ['manual'] },
		},
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
		description: 'Array of items to create. Example: [{"title":"Example","properties":{}}]',
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
				description: 'Permit Craft to auto-create new select options present in the payload.',
			},
		],
	},
	{
		displayName: 'Items to Update',
		name: 'collectionItemsToUpdate',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of items with IDs to update. Example: [{"id":"1","title":"Updated"}]',
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
				description: 'Permit Craft to auto-create new select options present in the payload.',
			},
		],
	},
	{
		displayName: 'IDs to Delete',
		name: 'collectionIdsToDelete',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of collection item IDs to delete. Example: ["1","2"]',
		displayOptions: show('delete'),
	},
];
