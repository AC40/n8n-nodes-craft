import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: {
		resource: ['block'],
		operation: ['construct'],
	},
});

export const blockConstructProperties: INodeProperties[] = [
	{
		displayName: 'Blocks',
		name: 'blocks',
		type: 'json',
		noDataExpression: false,
		default: '[]',
		required: true,
		description: 'Array of block objects to create (validated)',
		displayOptions: show('validatedBlockCreate'),
	},
];
