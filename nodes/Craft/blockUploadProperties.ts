import type { INodeProperties } from 'n8n-workflow';

const display = { resource: ['block'], operation: ['upload'] };

export const blockUploadProperties: INodeProperties[] = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property that holds the file to upload',
		displayOptions: { show: display },
	},
	{
		displayName: 'File Name',
		name: 'uploadFileName',
		type: 'string',
		default: '',
		description:
			'Override the file name sent to Craft. Defaults to the binary file name if left empty.',
		displayOptions: { show: display },
	},
	{
		displayName: 'MIME Type',
		name: 'uploadMimeType',
		type: 'string',
		default: '',
		description:
			'Override the MIME type sent to Craft. Defaults to the binary MIME type or application/octet-stream.',
		displayOptions: { show: display },
	},
	{
		displayName: 'Block Options',
		name: 'uploadBlockOptions',
		type: 'collection',
		default: { blockType: 'file' },
		placeholder: 'Add block option',
		displayOptions: { show: display },
		options: [
			{
				displayName: 'Block Type',
				name: 'blockType',
				type: 'options',
				options: [
					{ name: 'File', value: 'file' },
					{ name: 'Image', value: 'image' },
					{ name: 'Video', value: 'video' },
				],
				default: 'file',
			},
			{
				displayName: 'Alt Text',
				name: 'altText',
				type: 'string',
				default: '',
				description: 'Optional descriptive text for image or video blocks',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'string',
				default: '',
				description: 'Optional width setting for image or video blocks (e.g. auto, 600)',
			},
		],
	},
	{
		displayName: 'Upload Position',
		name: 'uploadPosition',
		type: 'collection',
		default: { type: 'end' },
		placeholder: 'Add position details',
		displayOptions: { show: display },
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
				description: 'Required when position type is End of Page',
			},
			{
				displayName: 'Sibling ID',
				name: 'siblingId',
				type: 'string',
				default: '',
				description: 'Required when position type is Before or After',
			},
		],
	},
];
