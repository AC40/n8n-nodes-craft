import type { INodeProperties } from 'n8n-workflow';

const show = (operation: string | string[]) => ({
	show: {
		resource: ['task'],
		operation: Array.isArray(operation) ? operation : [operation],
	},
});

export const taskOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['task'] } },
	default: 'list',
	options: [
		{
			name: 'List Tasks',
			value: 'list',
			action: 'List tasks',
			description: 'Retrieve tasks filtered by scope',
		},
		{
			name: 'Create Task',
			value: 'create',
			action: 'Create a task',
			description: 'Create a new task in inbox or daily notes',
		},
		{
			name: 'Update Task',
			value: 'update',
			action: 'Update a task',
			description: 'Modify an existing task',
		},
		{
			name: 'Delete Tasks',
			value: 'delete',
			action: 'Delete tasks',
			description: 'Delete tasks by their IDs',
		},
	],
};

export const taskProperties: INodeProperties[] = [
	{
		displayName: 'Task Scope',
		name: 'taskScope',
		type: 'options',
		default: 'active',
		required: true,
		description: 'Filter tasks by scope',
		displayOptions: show('list'),
		options: [
			{
				name: 'Active',
				value: 'active',
				description: 'Active tasks from inbox and other documents',
			},
			{
				name: 'Upcoming',
				value: 'upcoming',
				description: 'Upcoming tasks from inbox and other documents',
			},
			{
				name: 'Inbox',
				value: 'inbox',
				description: 'Only tasks in the task inbox',
			},
			{
				name: 'Logbook',
				value: 'logbook',
				description: 'Only tasks in the task logbook',
			},
		],
	},
	{
		displayName: 'Task Markdown',
		name: 'taskMarkdown',
		type: 'string',
		default: '',
		required: true,
		description: 'The markdown content of the task',
		displayOptions: show('create'),
	},
	{
		displayName: 'Location',
		name: 'taskLocation',
		type: 'options',
		default: 'inbox',
		description: 'Where to create the task',
		displayOptions: show('create'),
		options: [
			{
				name: 'Inbox',
				value: 'inbox',
			},
			{
				name: 'Daily Note',
				value: 'dailyNote',
			},
		],
	},
	{
		displayName: 'Create Options',
		name: 'taskCreateOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('create'),
		options: [
			{
				displayName: 'Schedule Date',
				name: 'scheduleDate',
				type: 'string',
				default: '',
				description: 'ISO date (YYYY-MM-DD) or relative date (today, tomorrow, yesterday)',
			},
			{
				displayName: 'Deadline Date',
				name: 'deadlineDate',
				type: 'string',
				default: '',
				description: 'ISO date (YYYY-MM-DD) or relative date (today, tomorrow, yesterday)',
			},
		],
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the task to update',
		displayOptions: show('update'),
	},
	{
		displayName: 'Update Options',
		name: 'taskUpdateOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: show('update'),
		options: [
			{
				displayName: 'Markdown',
				name: 'markdown',
				type: 'string',
				default: '',
				description: 'Updated markdown content of the task',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				default: '',
				description: 'Task state',
				options: [
					{
						name: 'To Do',
						value: 'todo',
					},
					{
						name: 'Done',
						value: 'done',
					},
					{
						name: 'Cancelled',
						value: 'cancelled',
					},
				],
			},
			{
				displayName: 'Schedule Date',
				name: 'scheduleDate',
				type: 'string',
				default: '',
				description: 'ISO date (YYYY-MM-DD) or relative date (today, tomorrow, yesterday)',
			},
			{
				displayName: 'Deadline Date',
				name: 'deadlineDate',
				type: 'string',
				default: '',
				description: 'ISO date (YYYY-MM-DD) or relative date (today, tomorrow, yesterday)',
			},
		],
	},
	{
		displayName: 'Task IDs',
		name: 'taskIds',
		type: 'string',
		default: '',
		required: true,
		description:
			'Task IDs to delete (comma-separated string or array of IDs for multiple)',
		displayOptions: show('delete'),
	},
];

