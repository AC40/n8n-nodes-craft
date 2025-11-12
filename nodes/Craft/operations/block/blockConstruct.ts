import { IExecuteFunctions, ICredentialDataDecryptedObject, IDataObject } from 'n8n-workflow';
import { parseParameter } from '../../helpers';

export function blockConstruct(
	this: IExecuteFunctions,
	index: number,
	credential: ICredentialDataDecryptedObject | null,
	documentId: string,
	returnData: IDataObject[],
): string {
	const blocksParam = this.getNodeParameter('blocks', index);
	const blocks = parseParameter<IDataObject[]>(blocksParam) ?? [];

	return JSON.stringify(blocks);
}
