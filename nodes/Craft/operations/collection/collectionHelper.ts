import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
export function getCollectionEndpoint(
	this: IExecuteFunctions,
	index: number,
): { endpoint: string; collectionId: string } {
	const collectionLocator = this.getNodeParameter('collectionLocator', index) as IDataObject;
	const rawValue = typeof collectionLocator.value === 'string' ? collectionLocator.value : '';
	const collectionId = rawValue.trim();

	if (!collectionId) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Please select or provide a collection ID.' },
			{ itemIndex: index },
		);
	}

	const encodedCollectionId = encodeURIComponent(collectionId);
	const collectionEndpoint = `/collections/${encodedCollectionId}/items`;
	return { endpoint: collectionEndpoint, collectionId };
}
