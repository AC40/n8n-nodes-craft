import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: { resource: ['block'], operation: Array.isArray(operation) ? operation : [operation] },
});

export const blockMutationProperties: INodeProperties[] = [
	{
		displayName: 'Blocks',
		name: 'blocks',
		type: 'json',
		noDataExpression: false,
		default: '[]',
		required: true,
		description: 'Array of block objects to create',
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
					{ name: 'Start of Page', value: 'start' },
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
				description:
					'The page ID where to insert the block when position type is Start of Page or End of Page. Defaults to 0 (root document).',
			},
			{
				displayName: 'Sibling ID',
				name: 'siblingId',
				type: 'string',
				default: '',
				placeholder: 'Required when position type is Before or After',
				description: 'The ID of the sibling block.',
			},
		],
	},
	{
		displayName: 'Blocks',
		name: 'updatedBlocks',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of block updates with IDs and fields to change',
		displayOptions: show('update'),
	},
	{
		displayName: 'Input Mode',
		name: 'deleteInputMode',
		type: 'options',
		options: [
			{ name: 'JSON', value: 'json' },
			{ name: 'Form', value: 'form' },
		],
		default: 'form',
		description:
			'Choose how to input block IDs: JSON for direct editing or Form for structured input',
		displayOptions: show('delete'),
	},
	{
		displayName: 'Block IDs',
		name: 'blockIdsJson',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of block IDs to delete (e.g., ["id1", "id2"])',
		displayOptions: {
			show: {
				resource: ['block'],
				operation: ['delete'],
				deleteInputMode: ['json'],
			},
		},
	},
	{
		displayName: 'Delete Parameters',
		name: 'deleteParameters',
		type: 'collection',
		placeholder: 'Add delete details',
		default: {},
		displayOptions: {
			show: {
				resource: ['block'],
				operation: ['delete'],
				deleteInputMode: ['form'],
			},
		},
		options: [
			{
				displayName: 'Block IDs',
				name: 'blockIds',
				type: 'string',
				typeOptions: { multipleValues: true },
				default: [],
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
				description: 'Required when position type is End of Page',
				displayOptions: {
					show: {
						'moveParameters.positionType': ['end'],
					},
				},
			},
			{
				displayName: 'Sibling ID',
				name: 'siblingId',
				type: 'string',
				default: '',
				description: 'Required when position type is Before or After',
				displayOptions: {
					show: {
						'moveParameters.positionType': ['before', 'after'],
					},
				},
			},
		],
	},
];
