import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: {
		resource: ['block'],
		operation: ['construct'],
	},
});

export const blockConstructProperties: INodeProperties[] = [
	{
		displayName: 'Input Data Mode',
		name: 'inputDataMode',
		type: 'options',
		options: [
			{ name: 'Define using fields below', value: 'fields' },
			{ name: 'Define using JSON example', value: 'json' },
		],
		default: 'fields',
		description: 'Choose how to input block data',
		displayOptions: show('construct'),
	},
	{
		displayName: 'Blocks',
		name: 'blocksJson',
		type: 'json',
		noDataExpression: false,
		default: '[]',
		required: true,
		description:
			'Provide an example object to infer fields and their types. To allow any type for a given field, set the value to null.',
		displayOptions: {
			show: {
				resource: ['block'],
				operation: ['construct'],
				inputDataMode: ['json'],
			},
		},
	},
	{
		displayName: 'Block Fields',
		name: 'columns',
		type: 'resourceMapper',
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		required: true,
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'getMappingColumns',
				mode: 'add',
				fieldWords: {
					singular: 'field',
					plural: 'fields',
				},
				addAllFields: true,
				supportAutoMap: true,
			},
		},
		displayOptions: {
			show: {
				resource: ['block'],
				operation: ['construct'],
				inputDataMode: ['fields'],
			},
		},
	},
];
