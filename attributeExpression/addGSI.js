const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({
	region: 'ap-south-1'
});

const params = {
	TableName: 'covid-data',
	AttributeDefinitions: [
		{
			AttributeName: 'location',
			AttributeType: 'S'
		},
		{
			AttributeName: 'continent',
			AttributeType: 'S'
		}
	],
	GlobalSecondaryIndexUpdates: [
		{
			Create: {
				IndexName: 'GSI',
				KeySchema: [
					{
						AttributeName: 'location',
						KeyType: 'HASH'
					},
					{
						AttributeName: 'continent',
						KeyType: 'RANGE'
					}
				],
				Projection: {
					NonKeyAttributes: [ 'STRING_VALUE' ],
					ProjectionType: 'ALL'
				}
			}
		}
	]
};

dynamodb.updateTable(params, function(err, data) {
	if (err)
		console.log(err, err.stack); // an error occurred
	else console.log(data); // successful response
});

/*
Result
{
  TableDescription: {
    AttributeDefinitions: [ [Object], [Object], [Object], [Object] ],
    TableName: 'covid-data',
    KeySchema: [ [Object], [Object] ],
    TableStatus: 'UPDATING',
    CreationDateTime: 2021-07-01T18:29:43.153Z,
    ProvisionedThroughput: {
      NumberOfDecreasesToday: 0,
      ReadCapacityUnits: 0,
      WriteCapacityUnits: 0
    },
    TableSizeBytes: 0,
    ItemCount: 0,
    TableArn: 'arn:aws:dynamodb:ap-south-1:925122152599:table/covid-data',
    TableId: '30d66755-f176-445a-af1a-6e3bd08fc080',
    BillingModeSummary: {
      BillingMode: 'PAY_PER_REQUEST',
      LastUpdateToPayPerRequestDateTime: 2021-07-01T18:29:43.153Z
    },
    GlobalSecondaryIndexes: [ [Object] ]
  }
}

*/