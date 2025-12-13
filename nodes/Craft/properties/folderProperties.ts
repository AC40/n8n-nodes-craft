import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: {
		resource: ['folder'],
		operation: Array.isArray(operation) ? operation : [operation],
	},
});

export const folderOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['folder'] } },
	default: 'list',
	options: [
		{
			name: 'List Folders',
			value: 'list',
			action: 'List folders',
			description: 'Retrieve all folders and locations in the space',
		},
		{
			name: 'Create Folder',
			value: 'create',
			action: 'Create a folder',
			description: 'Create a new folder or location',
		},
		{
			name: 'Delete Folder',
			value: 'delete',
			action: 'Delete a folder',
			description: 'Delete a folder by its ID',
		},
		{
			name: 'Move Folder',
			value: 'move',
			action: 'Move a folder',
			description: 'Move a folder to a different location',
		},
	],
};

export const folderProperties: INodeProperties[] = [
	{
		displayName: 'Folder Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the folder to create',
		displayOptions: show('create'),
	},
	{
		displayName: 'Parent Folder ID',
		name: 'parentId',
		type: 'string',
		default: '',
		description: 'The ID of the parent folder (leave empty for root level)',
		displayOptions: show('create'),
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the folder to delete',
		displayOptions: show('delete'),
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the folder to move',
		displayOptions: show('move'),
	},
	{
		displayName: 'Target Parent ID',
		name: 'targetParentId',
		type: 'string',
		default: '',
		description: 'The ID of the target parent folder (leave empty for root level)',
		displayOptions: show('move'),
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'options',
		default: 'end',
		description: 'Position within the target folder',
		displayOptions: show('move'),
		options: [
			{
				name: 'Start',
				value: 'start',
			},
			{
				name: 'End',
				value: 'end',
			},
		],
	},
];
