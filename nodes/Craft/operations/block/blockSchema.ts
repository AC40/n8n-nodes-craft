export const blockSchema = {
	title: 'Block',
	description: 'Single block object with its nested children',
	anyOf: [
		{
			title: 'Text Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['text'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				textStyle: {
					description:
						"h1-h4, body, caption styles apply to text blocks, card and page styles are visual styles for page blocks. Edge cases: a block with 'page' (or 'card') textStyle is always a page block, even if empty, however a page block can exist with 'body' textStyle which will be rendered as normal paragraph (but will otherwise act as a page inside Craft).",
					title: 'Text Style',
					type: 'string',
					enum: ['card', 'page', 'h1', 'h2', 'h3', 'h4', 'caption', 'body'],
				},
				textAlignment: {
					description: 'default is left',
					title: 'Text Alignment',
					type: 'string',
					enum: ['left', 'center', 'right', 'justify'],
				},
				font: {
					title: 'Font',
					type: 'string',
					enum: ['system', 'serif', 'rounded', 'mono'],
				},
				cardLayout: {
					description:
						"Applies for 'card' textStyle. Small and square are for laying out in multi-column (2 or 3 depending on screen size, multi-column is only supported for certain block types, not for text). Regular and large are full width cards.",
					title: 'Card Layout',
					type: 'string',
					enum: ['small', 'square', 'regular', 'large'],
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Page Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['page'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				title: {
					type: 'object',
					properties: {
						value: {
							type: 'string',
						},
						attributes: {
							type: 'array',
							items: {
								allOf: [
									{
										oneOf: [
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['link'],
													},
													url: {
														type: 'string',
														format: 'uri',
													},
												},
												required: ['type', 'url'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['blockLink'],
													},
													blockId: {
														title: 'Block ID',
														description:
															"Short ID of the linked block (or 'out_of_scope' if the target is outside the document)",
														type: 'string',
													},
												},
												required: ['type', 'blockId'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['bold'],
													},
												},
												required: ['type'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['italic'],
													},
												},
												required: ['type'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['strikethrough'],
													},
												},
												required: ['type'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['code'],
													},
												},
												required: ['type'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['highlight'],
													},
													color: {
														type: 'string',
														enum: [
															'yellow',
															'green',
															'mint',
															'cyan',
															'blue',
															'purple',
															'pink',
															'red',
															'gray',
															'gradient-blue',
															'gradient-purple',
															'gradient-red',
															'gradient-yellow',
															'gradient-brown',
														],
													},
												},
												required: ['type', 'color'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['dateLink'],
													},
													date: {
														title: 'Date',
														description: 'The date this badge links to. ISO format YYYY-MM-DD',
														type: 'string',
														format: 'date',
													},
												},
												required: ['type', 'date'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['userLink'],
													},
													userId: {
														type: 'string',
													},
												},
												required: ['type', 'userId'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['formula'],
													},
												},
												required: ['type'],
												additionalProperties: false,
											},
											{
												type: 'object',
												properties: {
													type: {
														type: 'string',
														enum: ['commentMarker'],
													},
													markerId: {
														type: 'string',
													},
												},
												required: ['type', 'markerId'],
												additionalProperties: false,
											},
										],
										type: 'object',
									},
									{
										type: 'object',
										properties: {
											start: {
												type: 'number',
											},
											end: {
												type: 'number',
											},
										},
										required: ['start', 'end'],
										additionalProperties: false,
									},
								],
							},
						},
					},
					required: ['value', 'attributes'],
					additionalProperties: false,
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
				textStyle: {
					description:
						"h1-h4, body, caption styles apply to text blocks, card and page styles are visual styles for page blocks. Edge cases: a block with 'page' (or 'card') textStyle is always a page block, even if empty, however a page block can exist with 'body' textStyle which will be rendered as normal paragraph (but will otherwise act as a page inside Craft).",
					title: 'Text Style',
					type: 'string',
					enum: ['card', 'page', 'h1', 'h2', 'h3', 'h4', 'caption', 'body'],
				},
				textAlignment: {
					description: 'default is left',
					title: 'Text Alignment',
					type: 'string',
					enum: ['left', 'center', 'right', 'justify'],
				},
				font: {
					title: 'Font',
					type: 'string',
					enum: ['system', 'serif', 'rounded', 'mono'],
				},
				cardLayout: {
					description:
						"Applies for 'card' textStyle. Small and square are for laying out in multi-column (2 or 3 depending on screen size, multi-column is only supported for certain block types, not for text). Regular and large are full width cards.",
					title: 'Card Layout',
					type: 'string',
					enum: ['small', 'square', 'regular', 'large'],
				},
				content: {
					description: 'Content of the page block. Array of blocks. Follows the same block schema.',
					type: 'array',
					items: {},
				},
			},
			required: ['type', 'id', 'title', 'markdown', 'content'],
			additionalProperties: false,
		},
		{
			title: 'Collection Item Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['collectionItem'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				title: {
					title: 'Title',
					description: 'The title of the block.',
					type: 'string',
				},
				properties: {
					title: 'Properties',
					description: 'The properties of the block.',
					type: 'object',
					additionalProperties: {},
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
				content: {
					description:
						"Content of the collection item block's page. Array of blocks. Follows the same block schema.",
					type: 'array',
					items: {},
				},
			},
			required: ['type', 'id', 'title', 'properties', 'markdown', 'content'],
			additionalProperties: false,
		},
		{
			title: 'Image Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['image'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				url: {
					title: 'URL',
					type: 'string',
				},
				altText: {
					title: 'Alt Text',
					type: 'string',
				},
				size: {
					title: 'Media Size',
					type: 'string',
					enum: ['fit', 'fill'],
				},
				width: {
					title: 'Media Layout',
					type: 'string',
					enum: ['auto', 'fullWidth'],
				},
				uploaded: {
					type: 'boolean',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'url', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Video Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['video'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				url: {
					title: 'URL',
					type: 'string',
				},
				altText: {
					title: 'Alt Text',
					type: 'string',
				},
				size: {
					title: 'Media Size',
					type: 'string',
					enum: ['fit', 'fill'],
				},
				width: {
					title: 'Media Layout',
					type: 'string',
					enum: ['auto', 'fullWidth'],
				},
				uploaded: {
					type: 'boolean',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'url', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'File Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['file'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				url: {
					title: 'URL',
					type: 'string',
				},
				fileName: {
					title: 'File Name',
					description: 'The name of the file.',
					type: 'string',
				},
				blockLayout: {
					title: 'Layout',
					type: 'string',
					enum: ['small', 'regular', 'card'],
				},
				uploaded: {
					type: 'boolean',
				},
				mimeType: {
					type: 'string',
				},
				fileSize: {
					type: 'number',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'url', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Drawing Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['drawing'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				url: {
					title: 'URL',
					type: 'string',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'url', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Whiteboard Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['whiteboard'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				url: {
					title: 'URL',
					type: 'string',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Table Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['table'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Collection Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['collection'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Code Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['code'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				rawCode: {
					title: 'Raw Code',
					description: 'The raw code of the block.',
					type: 'string',
				},
				language: {
					title: 'Code Language',
					type: 'string',
					enum: [
						'text',
						'cpp',
						'cs',
						'css',
						'go',
						'java',
						'javascript',
						'json',
						'kotlin',
						'objectivec',
						'php',
						'python',
						'ruby',
						'shell',
						'sql',
						'swift',
						'typescript',
						'html',
						'rust',
						'perl',
						'yaml',
						'xml',
						'math_formula',
					],
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'rawCode', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Rich Link Block',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['richUrl'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				url: {
					title: 'URL',
					type: 'string',
				},
				title: { type: 'string' },
				description: {
					type: 'string',
				},
				layout: {
					title: 'Layout',
					type: 'string',
					enum: ['small', 'regular', 'card'],
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'url', 'markdown'],
			additionalProperties: false,
		},
		{
			title: 'Line Block (Separator)',
			type: 'object',
			properties: {
				type: {
					title: 'Type',
					type: 'string',
					enum: ['line'],
				},
				id: {
					title: 'Block ID',
					type: 'string',
				},
				lineStyle: {
					default: 'regular',
					description:
						'pageBreak lineStyle is just a strong visual separator within a page (chunks to page-looking groups visually). It does not affect the page block hierarchy.',
					title: 'Line Style',
					type: 'string',
					enum: ['strong', 'regular', 'light', 'extraLight', 'pageBreak'],
				},
				markdown: {
					title: 'Markdown',
					description: 'The markdown content of the block.',
					type: 'string',
				},
				indentationLevel: {
					title: 'Indentation Level',
					description: 'The indentation level of the block.',
					type: 'integer',
					minimum: 0,
					maximum: 5,
				},
				listStyle: {
					title: 'List Style',
					type: 'string',
					enum: ['none', 'bullet', 'numbered', 'toggle', 'task'],
				},
				decorations: {
					title: 'Decorations',
					type: 'array',
					items: {
						type: 'string',
						enum: ['callout', 'quote'],
					},
				},
				color: {
					title: 'Color',
					description:
						'7-character hex code (e.g., #RRGGBB). Case-insensitive. Auto-adjusted for readability, with dark variant auto-generated.',
					type: 'string',
					pattern: '^#[0-9a-fA-F]{6}$',
				},
				taskInfo: {
					description: "only interpreted, if listStyle is 'task'",
					title: 'Task Info',
					type: 'object',
					properties: {
						state: {
							default: 'todo',
							type: 'string',
							enum: ['todo', 'done', 'canceled'],
						},
						scheduleDate: {
							title: 'Schedule Date',
							description: 'Planned execution date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
						deadlineDate: {
							title: 'Deadline Date',
							description: 'Due date of the task. ISO format YYYY-MM-DD',
							type: 'string',
							format: 'date',
						},
					},
					required: ['state'],
					additionalProperties: false,
				},
				metadata: {
					title: 'Block Metadata',
					type: 'object',
					properties: {
						lastModifiedAt: {
							title: 'Last Modified At',
							description: 'The date and time the block was last modified.',
							type: 'string',
							format: 'date',
						},
						createdAt: {
							title: 'Created At',
							description: 'The date and time the block was created.',
							type: 'string',
							format: 'date',
						},
						lastModifiedBy: {
							title: 'Last Modified By',
							description: 'The user who last modified the block.',
							type: 'string',
						},
						createdBy: {
							title: 'Created By',
							description: 'The user who created the block.',
							type: 'string',
						},
						comments: {
							title: 'Comments',
							description: 'The comments on the block.',
							type: 'array',
							items: {
								title: 'Comment',
								type: 'object',
								properties: {
									id: {
										title: 'ID',
										description: 'The ID of the comment.',
										type: 'string',
									},
									author: {
										title: 'Author',
										description: 'The author of the comment.',
										type: 'string',
									},
									content: {
										title: 'Content',
										description: 'The content of the comment.',
										type: 'string',
									},
									createdAt: {
										title: 'Created At',
										description: 'The date and time the comment was created.',
										type: 'string',
										format: 'date',
									},
								},
								required: ['id', 'author', 'content', 'createdAt'],
								additionalProperties: false,
							},
						},
					},
					required: ['lastModifiedAt', 'createdAt', 'lastModifiedBy', 'createdBy'],
					additionalProperties: false,
				},
			},
			required: ['type', 'id', 'lineStyle', 'markdown'],
			additionalProperties: false,
		},
	],
} as const;
