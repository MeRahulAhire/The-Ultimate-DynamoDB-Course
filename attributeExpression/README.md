# Specifying Item Attributes When Using Expressions

## JSON sample for this module

```json
{
    "Id": 123,
    "Title": "Bicycle 123",
    "Description": "123 description",
    "BicycleType": "Hybrid",
    "Brand": "Brand-Company C",
    "Price": 500,
    "Color": ["Red", "Black"],
    "ProductCategory": "Bicycle",
    "InStock": true,
    "QuantityOnHand": null,
    "RelatedItems": [
        341,
        472,
        649
    ],
    "Pictures": {
        "FrontView": "http://example.com/products/123_front.jpg",
        "RearView": "http://example.com/products/123_rear.jpg",
        "SideView": "http://example.com/products/123_left_side.jpg"
    },
    "ProductReviews": {
	    "FiveStar": [
	    		"Excellent! Can't recommend it highly enough! Buy it!",
	    		"Do yourself a favor and buy this."
	    ],
	    "OneStar": [
	    		"Terrible product! Do not buy this."
	    ]
    },
    "Comment": "This product sells out quickly during the summer",
    "Safety.Warning": "Always wear a helmet"
 }

```

### Top level Attribute

- `Id`
- `Title`
- `Description`
- `BicycleType`
- `Price`
- `Color`
- `ProductCategory`
- `InStock`
- `QuantityOnHand`
- `RelatedItems`
- `Pictures`
- `ProductReviews`
- `Comment`
- `Safety.Warning`

### Nested Attributed 

- `[n]`
- `.`(dot)

### Accessing List Elements

- `MyList[0]`

- `AnotherList[12]`

- `ThisList[5][11]`

### Accessing Map Elements
- `MyMap.nestedField`
- `MyMap.nestedField.deeplyNestedField`


## Projection Expression
To read data from a table, you use operations such as `GetItem`, `Query`, or `Scan`. Amazon DynamoDB returns all the item attributes by default. To get only some, rather than all of the attributes, use a projection expression - From AWS Docs. 

In Layman terms you can call it as a selective picker which gets only selective items that you need and prevents over fetching thus saving throughput and money.

Instead of using CLI, we'll use Javascript AWS-SDK v2 because [v3-js-sdk isn't yet documented well enough.](https://github.com/aws/aws-sdk-js-v3/issues/2184  "Incomplete documentation aws-sdk-js-v3 #2184")


### Lets get `Description`, `RelatedItems[0]`, `ProductReviews.FiveStar` with [getItem](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property)

```js
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
	region: 'ap-south-1'
});

var params = {
	TableName: 'itemOps',
	Key: {
		Id: 123
	},
	ProjectionExpression: 'Description, RelatedItems[0], ProductReviews.FiveStar'
};

docClient.get(params, function(err, data) {
	if (err)
		console.log(err, err.stack); // an error occurred
	else console.log(data); // successful response
});
```
**Result**
```js
{
  Item: {
    ProductReviews: { FiveStar: [Array] },
    RelatedItems: [ 341 ],
    Description: '123 description'
  }
}
```
## Reserved Words

Sometime the Projection Expression will not work due to the reserved keywords in DynamoDB and there's around 573 as of now and its hard to keep track of all of these keywords and it's highly unlikely that you won't come across the Reserved Keywords error like below

```bash
ValidationException: Invalid ProjectionExpression: Attribute name is a reserved keyword; reserved keyword: Comment
```
so it's always advisable to use `ExpressionAttributeNames` in combination with `ProjectionExpression`

To assign a `ExpressionAttributeNames` variable using `#` keyword
eg:

- `#YT`
- `#c`
- `#name`

It can be any random variable.

### So let's try to get an attribute `Comment` from our JSON date which is a reserved keyword

```js
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
```
**Result**
```js
{
  Item: { Comment: 'This product sells out quickly during the summer' },
  ConsumedCapacity: { TableName: 'itemOps', CapacityUnits: 0.5 }
}
```
