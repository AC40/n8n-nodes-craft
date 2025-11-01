import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: { resource: ['block'], operation: Array.isArray(operation) ? operation : [operation] },
});

export const blockMutationProperties: INodeProperties[] = [
	{
		displayName: 'Blocks',
		name: 'blocks',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of block objects to create.',
		displayOptions: show('insert'),
	},
	{
		displayName: 'Insert Position',
		name: 'insertPosition',
		type: 'collection',
		placeholder: 'Add position details',
		default: { type: 'end' },
		displayOptions: show('insert'),
		options: [
			{
				displayName: 'Position Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'End of Page', value: 'end' },
					{ name: 'Before Block', value: 'before' },
					{ name: 'After Block', value: 'after' },
				],
				default: 'end',
			},
			{
				displayName: 'Page ID',
				name: 'pageId',
				type: 'string',
				default: '',
				description: 'Required when position type is End of Page.',
			},
			{
				displayName: 'Sibling ID',
				name: 'siblingId',
				type: 'string',
				default: '',
				description: 'Required when position type is Before or After.',
			},
		],
	},
	{
		displayName: 'Blocks',
		name: 'updatedBlocks',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of block updates with IDs and fields to change.',
		displayOptions: show('update'),
	},
	{
		displayName: 'Delete Parameters',
		name: 'deleteParameters',
		type: 'collection',
		placeholder: 'Add delete details',
		default: {},
		displayOptions: show('delete'),
		options: [
			{
				displayName: 'Block IDs',
				name: 'blockIds',
				type: 'string',
				typeOptions: { multipleValues: true },
				default: [],
				required: true,
				description: 'IDs of blocks to delete. Use one entry per ID.',
			},
		],
	},
	{
		displayName: 'Move Parameters',
		name: 'moveParameters',
		type: 'collection',
		placeholder: 'Add move details',
		default: { positionType: 'after' },
		displayOptions: show('move'),
		options: [
			{
				displayName: 'Block IDs',
				name: 'blockIds',
				type: 'string',
				typeOptions: { multipleValues: true },
				default: [],
				required: true,
				description: 'IDs of blocks to move. Use one entry per ID.',
			},
			{
				displayName: 'Position Type',
				name: 'positionType',
				type: 'options',
				options: [
					{ name: 'Before Block', value: 'before' },
					{ name: 'After Block', value: 'after' },
					{ name: 'End of Page', value: 'end' },
				],
				default: 'after',
			},
			{
				displayName: 'Page ID',
				name: 'pageId',
				type: 'string',
				default: '',
				description: 'Required when position type is End of Page.',
			},
			{
				displayName: 'Sibling ID',
				name: 'siblingId',
				type: 'string',
				default: '',
				description: 'Required when position type is Before or After.',
			},
		],
	},
];
