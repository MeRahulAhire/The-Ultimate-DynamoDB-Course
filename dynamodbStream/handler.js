'use strict';

module.exports.hello = async (event) => {
  console.log(event, event.Records[0].dynamodb)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
