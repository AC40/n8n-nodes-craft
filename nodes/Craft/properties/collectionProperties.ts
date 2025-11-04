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
	],
};

export const collectionProperties: INodeProperties[] = [
	{
		displayName: 'Collection',
		name: 'collectionLocator',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select or enter the collection to target',
		displayOptions: { show: { resource: ['collection'] } },
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
				placeholder: 'collection_slug',
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
		description: 'Array of items with IDs to update. Example: [{"id":"1","properties": { ... }}]',
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
