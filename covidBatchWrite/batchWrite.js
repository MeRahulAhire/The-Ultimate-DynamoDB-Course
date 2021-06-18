const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
	region: 'ap-south-1'
});

const tableName = 'covid-data';
const fileName = 'owid-covid-data.csv';
const rs = fs.createReadStream(fileName);
const parser = parse(
	{
		columns: true,
		delimiter: ','
	},
	function(err, data) {
		var chunckData = [],
			size = 25;

		while (data.length > 0) {
			chunckData.push(data.splice(0, size));
		}
		let chunkNumber = 1; 

		async.each(
			chunckData,
			function(item_data, callback) {
				const params = {
					RequestItems: {}
				};

				params.RequestItems[tableName] = [];
				item_data.forEach((item) => {
					for (key of Object.keys(item)) {
						// An AttributeValue may not contain an empty string
						if (item[key] === '') delete item[key];
					}

					params.RequestItems[tableName].push({
						PutRequest: {
							Item: {
								...item
							}
						}
					});
				});
				docClient.batchWrite(params, function(err, data) {
					if (err == null) {
						console.log('Success count - ' + chunkNumber);
					} else {
						console.log(err);
						console.log('Failed chunk - ' + chunkNumber);
					}

					chunkNumber++;
					callback();
				});
			},
			function() {
				// run after loops
				console.log(`all data imported to DynamoDB Table ${tableName}`);
			}
		);
	}
);
rs.pipe(parser);
