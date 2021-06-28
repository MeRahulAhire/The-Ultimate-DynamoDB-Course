const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
	region: 'ap-south-1'
});

var params = {
	TableName: 'itemOps',
	Key: {
		Id: 123
	},
	ProjectionExpression: '#c',
    ExpressionAttributeNames:{
        '#c':'Comment'
    },
    ReturnConsumedCapacity: 'TOTAL'

};

docClient.get(params, function(err, data) {
	if (err)
		console.log(err, err.stack); // an error occurred
	else console.log(data); // successful response
});
