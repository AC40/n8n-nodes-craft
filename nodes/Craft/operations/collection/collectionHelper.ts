import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { toCollectionSlug } from '../../helpers';

export function getCollectionEndpoint(
	this: IExecuteFunctions,
	index: number,
): { endpoint: string; collectionName: string } {
	const collectionLocator = this.getNodeParameter('collectionLocator', index) as IDataObject;
	const mode = (collectionLocator.mode as string) || 'list';
	const rawCollectionValue =
		typeof collectionLocator.value === 'string' ? collectionLocator.value : '';
	const trimmedCollectionName = rawCollectionValue.trim();
	let collectionName = trimmedCollectionName;
	if (mode !== 'id') {
		collectionName = toCollectionSlug(trimmedCollectionName);
		console.log('collectionName', collectionName);
	} else {
		const slug = toCollectionSlug(trimmedCollectionName);
		if (slug) collectionName = slug;
	}
	if (!collectionName) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Please provide a collection name.' },
			{ itemIndex: index },
		);
	}
	const encodedCollectionName = encodeURIComponent(collectionName);
	const collectionEndpoint = `/collections/${encodedCollectionName}/items`;
	return { endpoint: collectionEndpoint, collectionName };
}
