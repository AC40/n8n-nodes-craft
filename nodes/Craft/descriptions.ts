import type { INodeProperties } from 'n8n-workflow';
import { blockFetchProperties } from './blockFetchProperties';
import { blockMutationProperties } from './blockMutationProperties';
import { blockSearchProperties } from './blockSearchProperties';

const documentPropery: INodeProperties = {
	displayName: 'Document',
	name: 'documentId',
	type: 'string',
	default: '',
	description:
		'ID of the document to fetch. Usually a 11 char string. Can be found by takting the part between "https://connect.craft.do/link/" and "/docs/v1"',
	displayOptions: { show: { resource: ['document'] } },
};

const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [{ name: 'Block', value: 'block' }],
	default: 'block',
};

const operations: Array<[value: string, name: string, action: string, description: string]> = [
	['fetch', 'Fetch Block', 'Fetch a block', 'Retrieve block content via GET /blocks'],
	['insert', 'Insert Blocks', 'Insert blocks', 'Create blocks via POST /blocks'],
	['delete', 'Delete Blocks', 'Delete blocks', 'Remove blocks via DELETE /blocks'],
	['update', 'Update Blocks', 'Update blocks', 'Modify blocks via PUT /blocks'],
	['move', 'Move Blocks', 'Move blocks', 'Reorder blocks via PUT /blocks/move'],
	['search', 'Search Blocks', 'Search blocks', 'Search content via GET /blocks/search'],
];

const operationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['block'] } },
	default: operations[0][0],
	options: operations.map(([value, name, action, description]) => ({
		name,
		value,
		action,
		description,
	})),
};

export const craftProperties: INodeProperties[] = [
	documentPropery,
	resourceProperty,
	operationProperty,
	...blockFetchProperties,
	...blockMutationProperties,
	...blockSearchProperties,
];
