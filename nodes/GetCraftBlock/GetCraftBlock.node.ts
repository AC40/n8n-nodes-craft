import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class GetCraftBlock implements INodeType {
	description: INodeTypeDescription = {
		properties: [
			{
				displayName: 'Craft API Key',
				name: 'craftApiKey',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['astronomyPictureOfTheDay'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get the APOD',
						description: 'Get the Astronomy Picture of the day',
						routing: {
							request: {
								method: 'GET',
								url: '/planetary/apod',
							},
						},
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['marsRoverPhotos'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get Mars Rover photos',
						description: 'Get photos from the Mars Rover',
						routing: {
							request: {
								method: 'GET',
							},
						},
					},
				],
				default: 'get',
			},
			{
				displayName: 'Rover name',
				description: 'Choose which Mars Rover to get a photo from',
				required: true,
				name: 'roverName',
				type: 'options',
				options: [
					{ name: 'Curiosity', value: 'curiosity' },
					{ name: 'Opportunity', value: 'opportunity' },
					{ name: 'Perseverance', value: 'perseverance' },
					{ name: 'Spirit', value: 'spirit' },
				],
				routing: {
					request: {
						url: '=/mars-photos/api/v1/rovers/{{$value}}/photos',
					},
				},
				default: 'curiosity',
				displayOptions: {
					show: {
						resource: ['marsRoverPhotos'],
					},
				},
			},
			{
				displayName: 'Date',
				description: 'Earth date',
				required: true,
				name: 'marsRoverDate',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['marsRoverPhotos'],
					},
				},
				routing: {
					request: {
						// You've already set up the URL. qs appends the value of the field as a query string
						qs: {
							earth_date: '={{ new Date($value).toISOString().substr(0,10) }}',
						},
					},
				},
			},
		],
		displayName: 'Get Craft Block',
		name: 'getCraftBlock',
		icon: 'file:craft_logo_original.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get a block from Craft',
		defaults: {
			name: 'Get Craft Block',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'CraftApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://connect.craft.do/links/GogouBnj9Cj/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
	};
}
