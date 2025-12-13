import type { INodeProperties } from 'n8n-workflow';
import { blockFetchProperties } from './properties/blockFetchProperties';
import { blockMutationProperties } from './properties/blockMutationProperties';
import { blockUploadProperties } from './properties/blockUploadProperties';
import { blockSearchProperties } from './properties/blockSearchProperties';
import {
	collectionOperationProperty,
	collectionProperties,
} from './properties/collectionProperties';
import { blockConstructProperties } from './properties/blockConstructProperties';
import { taskOperationProperty, taskProperties } from './properties/taskProperties';
import { documentOperationProperty, documentProperties } from './properties/documentProperties';
import { dailyNoteOperationProperty, dailyNoteProperties } from './properties/dailyNoteProperties';
import { folderOperationProperty, folderProperties } from './properties/folderProperties';

const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Block', value: 'block' },
		{ name: 'Collection', value: 'collection' },
		{ name: 'Daily Note', value: 'dailyNote' },
		{ name: 'Document', value: 'document' },
		{ name: 'Folder', value: 'folder' },
		{ name: 'Task', value: 'task' },
	],
	default: 'block',
};

const operations: Array<[value: string, name: string, action: string, description: string]> = [
	['fetch', 'Fetch Block', 'Fetch a block', 'Retrieve blocks and attached information'],
	['insert', 'Insert Blocks', 'Insert blocks', 'Create new blocks in a document'],
	['upload', 'Upload File', 'Upload a file', 'Insert files (binary content) into a document'],
	['delete', 'Delete Blocks', 'Delete blocks', 'Remove blocks from a document'],
	['update', 'Update Blocks', 'Update blocks', 'Modify blocks'],
	['move', 'Move Blocks', 'Move blocks', 'Reorder blocks in a document'],
	['search', 'Search Blocks', 'Search blocks', 'Search content'],
	['construct', 'Construct Blocks', 'Construct blocks', 'Construct blocks with validation'],
];

const operationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['block'] } },
	default: '',
	options: operations.map(([value, name, action, description]) => ({
		name,
		value,
		action,
		description,
	})),
};

export const craftProperties: INodeProperties[] = [
	resourceProperty,
	operationProperty,
	collectionOperationProperty,
	taskOperationProperty,
	documentOperationProperty,
	dailyNoteOperationProperty,
	folderOperationProperty,
	...collectionProperties,
	...taskProperties,
	...documentProperties,
	...dailyNoteProperties,
	...folderProperties,
	...blockFetchProperties,
	...blockMutationProperties,
	...blockUploadProperties,
	...blockSearchProperties,
	...blockConstructProperties,
];
