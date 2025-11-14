import { IExecuteFunctions, ICredentialDataDecryptedObject, IDataObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { parseParameter } from '../../helpers';

function buildBlockFromFields(blockFields: IDataObject): IDataObject {
	const block: IDataObject = {
		type: blockFields.type || 'text',
	};

	if (blockFields.id) {
		block.id = blockFields.id;
	}

	if (blockFields.markdown) {
		block.markdown = blockFields.markdown;
	}

	if (blockFields.textStyle) {
		block.textStyle = blockFields.textStyle;
	}

	if (blockFields.textAlignment) {
		block.textAlignment = blockFields.textAlignment;
	}

	if (blockFields.font) {
		block.font = blockFields.font;
	}

	if (blockFields.listStyle && blockFields.listStyle !== 'none') {
		block.listStyle = blockFields.listStyle;
	}

	if (blockFields.indentationLevel !== undefined && blockFields.indentationLevel !== 0) {
		block.indentationLevel = Number(blockFields.indentationLevel);
	}

	if (blockFields.color) {
		block.color = blockFields.color;
	}

	if (blockFields.url) {
		block.url = blockFields.url;
	}

	if (blockFields.altText) {
		block.altText = blockFields.altText;
	}

	if (blockFields.codeLanguage || blockFields.codeContent) {
		block.code = {
			language: blockFields.codeLanguage || '',
			content: blockFields.codeContent || '',
		};
	}

	return block;
}

export function blockConstruct(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): string {
	const inputMode = (this.getNodeParameter('inputDataMode', index, 'json') as string) || 'json';

	let blocks: IDataObject[];

	if (inputMode === 'json') {
		const blocksParam = this.getNodeParameter('blocksJson', index);
		blocks = parseParameter<IDataObject[]>(blocksParam) ?? [];
	} else {
		const items = this.getInputData();
		const columnsData = this.getNodeParameter('columns', index, {}) as IDataObject;

		if (items.length === 0) {
			blocks = [];
		} else {
			blocks = items.map((item, itemIndex) => {
				const mappedFields: IDataObject = {};

				if (columnsData.mappingMode === 'autoMapInputData') {
					Object.keys(item.json).forEach((key) => {
						mappedFields[key] = item.json[key];
					});
				} else {
					const value = columnsData.value as IDataObject;
					if (value) {
						Object.keys(value).forEach((fieldId) => {
							const fieldMapping = value[fieldId] as IDataObject;
							if (fieldMapping && fieldMapping.mappedValue !== undefined) {
								const mappedValue = fieldMapping.mappedValue as string;
								if (
									typeof mappedValue === 'string' &&
									mappedValue.startsWith('={{') &&
									mappedValue.endsWith('}}')
								) {
									const path = mappedValue.slice(3, -2).trim();
									if (path.startsWith('$json.')) {
										const fieldName = path.slice(6);
										mappedFields[fieldId] = item.json[fieldName];
									} else {
										mappedFields[fieldId] = mappedValue;
									}
								} else if (typeof mappedValue === 'string') {
									mappedFields[fieldId] = item.json[mappedValue] ?? mappedValue;
								} else {
									mappedFields[fieldId] = mappedValue;
								}
							} else if (fieldMapping && fieldMapping.value !== undefined) {
								mappedFields[fieldId] = fieldMapping.value;
							}
						});
					}
				}

				return buildBlockFromFields(mappedFields);
			});
		}
	}

	if (!Array.isArray(blocks)) {
		throw new NodeApiError(
			this.getNode(),
			{
				message: 'Blocks must be an array',
			},
			{ itemIndex: index },
		);
	}

	return JSON.stringify(blocks);
}
