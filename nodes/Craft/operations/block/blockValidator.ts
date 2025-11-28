import { IExecuteFunctions, NodeApiError, IDataObject } from 'n8n-workflow';
import { blockSchema } from './blockSchema';

type SchemaType = IDataObject & {
	type?: string;
	enum?: unknown[];
	pattern?: string;
	minimum?: number;
	maximum?: number;
	format?: string;
	required?: string[];
	properties?: Record<string, unknown>;
	items?: unknown;
	additionalProperties?: boolean;
	anyOf?: unknown[];
};

function validateValue(value: unknown, schema: SchemaType, path: string): string[] {
	const errors: string[] = [];

	if (schema.type) {
		if (schema.type === 'string' && typeof value !== 'string') {
			errors.push(`${path}: expected string, got ${typeof value}`);
		} else if (schema.type === 'integer' && typeof value !== 'number') {
			errors.push(`${path}: expected integer, got ${typeof value}`);
		} else if (schema.type === 'number' && typeof value !== 'number') {
			errors.push(`${path}: expected number, got ${typeof value}`);
		} else if (schema.type === 'boolean' && typeof value !== 'boolean') {
			errors.push(`${path}: expected boolean, got ${typeof value}`);
		} else if (
			schema.type === 'object' &&
			(typeof value !== 'object' || value === null || Array.isArray(value))
		) {
			errors.push(`${path}: expected object, got ${typeof value}`);
		} else if (schema.type === 'array' && !Array.isArray(value)) {
			errors.push(`${path}: expected array, got ${typeof value}`);
		}
	}

	if (schema.enum && Array.isArray(schema.enum) && !schema.enum.includes(value)) {
		errors.push(`${path}: value must be one of ${schema.enum.join(', ')}`);
	}

	if (schema.pattern && typeof schema.pattern === 'string' && typeof value === 'string') {
		const regex = new RegExp(schema.pattern);
		if (!regex.test(value)) {
			errors.push(`${path}: value does not match pattern ${schema.pattern}`);
		}
	}

	if (
		schema.minimum !== undefined &&
		typeof schema.minimum === 'number' &&
		typeof value === 'number' &&
		value < schema.minimum
	) {
		errors.push(`${path}: value must be >= ${schema.minimum}`);
	}

	if (
		schema.maximum !== undefined &&
		typeof schema.maximum === 'number' &&
		typeof value === 'number' &&
		value > schema.maximum
	) {
		errors.push(`${path}: value must be <= ${schema.maximum}`);
	}

	if (schema.format === 'date' && typeof value === 'string') {
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(value)) {
			errors.push(`${path}: date must be in ISO format YYYY-MM-DD`);
		}
	}

	return errors;
}

function validateObject(obj: unknown, schema: SchemaType, path: string): string[] {
	const errors: string[] = [];

	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		return [`${path}: expected object`];
	}

	const objRecord = obj as Record<string, unknown>;

	if (schema.required && Array.isArray(schema.required)) {
		for (const field of schema.required) {
			if (typeof field === 'string' && !(field in objRecord)) {
				errors.push(`${path}: missing required field '${field}'`);
			}
		}
	}

	if (schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties)) {
		for (const [key, value] of Object.entries(objRecord)) {
			const fieldSchema = schema.properties[key];
			if (fieldSchema && typeof fieldSchema === 'object' && !Array.isArray(fieldSchema)) {
				const fieldPath = path ? `${path}.${key}` : key;
				errors.push(...validateValue(value, fieldSchema as SchemaType, fieldPath));
				if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					errors.push(...validateAgainstSchema(value, fieldSchema as SchemaType, fieldPath));
				} else if (Array.isArray(value)) {
					const fieldSchemaTyped = fieldSchema as SchemaType;
					if (fieldSchemaTyped.items) {
						for (let i = 0; i < value.length; i++) {
							errors.push(
								...validateAgainstSchema(
									value[i],
									fieldSchemaTyped.items as SchemaType,
									`${fieldPath}[${i}]`,
								),
							);
						}
					}
				}
			} else if (schema.additionalProperties === false) {
				errors.push(`${path}: unexpected property '${key}'`);
			}
		}
	}

	return errors;
}

function validateAgainstSchema(value: unknown, schema: SchemaType, path: string): string[] {
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		const allErrors: string[] = [];
		for (const subSchema of schema.anyOf) {
			if (typeof subSchema === 'object' && subSchema !== null && !Array.isArray(subSchema)) {
				const subErrors = validateAgainstSchema(value, subSchema as SchemaType, path);
				if (subErrors.length === 0) {
					return [];
				}
				allErrors.push(...subErrors);
			}
		}
		return allErrors;
	}

	const errors: string[] = [];
	errors.push(...validateValue(value, schema, path));

	if (
		schema.type === 'object' &&
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value)
	) {
		errors.push(...validateObject(value, schema, path));
	}

	if (schema.type === 'array' && Array.isArray(value)) {
		if (schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items)) {
			for (let i = 0; i < value.length; i++) {
				errors.push(
					...validateAgainstSchema(value[i], schema.items as SchemaType, `${path}[${i}]`),
				);
			}
		}
	}

	return errors;
}

export function validateBlockData(this: IExecuteFunctions, data: unknown): unknown {
	if (!Array.isArray(data)) {
		throw new NodeApiError(this.getNode(), {
			message: 'Blocks must be an array',
		});
	}

	const allErrors: string[] = [];

	for (let i = 0; i < data.length; i++) {
		const block = data[i];
		const errors = validateAgainstSchema(block, blockSchema as unknown as SchemaType, `block[${i}]`);
		if (errors.length > 0) {
			allErrors.push(...errors);
		}
	}

	if (allErrors.length > 0) {
		throw new NodeApiError(this.getNode(), {
			message: `Block validation failed: ${allErrors.join('; ')}`,
		});
	}

	return data;
}
