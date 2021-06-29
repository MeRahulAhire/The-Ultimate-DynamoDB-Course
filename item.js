const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
	region: 'ap-south-1'
});

var params = {
	TableName: 'email',
	Item: {
		email: 'abc@example.com',
		data: 'this is a random data'
	},
	ConditionExpression: 'attribute_not_exists(email)'
};

docClient.put(params, function(err, data) {
	if (err)
		console.log(err, err.stack); // an error occurred
	else console.log(data); // successful response
});
