# Specifying Item Attributes When Using Expressions

## Table of content

1. [JSON sample](#JSON-sample-for-this-module)
   - [Top level Attribute](#top-level-attribute)
   - [Nested Attributed](#nested-attributed)
   - [Accessing List Elements](#accessing-list-elements)
   - [Accessing Map Elements](#accessing-map-elements)
2. [Creating Table `itemOps`](#creating-table-itemops)
   - [Insert our JSON data](#insert-our-json-data)
3. [Projection Expression](#projection-expression)
4. [Reserved Words](#reserved-words)
   - [example](#so-lets-try-to-get-an-attribute-comment-from-our-json-date-which-is-a-reserved-keyword)
5. [Attribute Names Containing Dots](#attribute-names-containing-dots)
6. [Nested Attributes](#nested-attributes)
7. [Repeating Attribute Names](#repeating-attribute-names)
8. [Expression Attribute Values](#expression-attribute-values)
9. [Condition Expressions](#condition-expressions)
   - [List of all Condition Expression](#list-of-all-condition-expression)
   - [Conditional Put in Javascript](#conditional-put-in-javascript)
10. [Comparison Operator and Function Reference](#comparison-operator-and-function-reference)
11. [Update Expressions](#update-expressions)
    - [SET](#set)
    - [ADD](#ADD)
    - [REMOVE](#REMOVE)
    - [DELETE](#DELETE)

12.[FilterExpress](#filterexpression)

### JSON sample for this module

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
  "RelatedItems": [341, 472, 649],
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
    "OneStar": ["Terrible product! Do not buy this."]
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

Instead of using CLI, we'll use Javascript AWS-SDK v2 and not the v3 because [v3-js-sdk isn't yet documented well enough.](https://github.com/aws/aws-sdk-js-v3/issues/2184 "Incomplete documentation aws-sdk-js-v3 #2184")

### Creating Table `itemOps`

```js
const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  AttributeDefinitions: [
    {
      AttributeName: "Id",
      AttributeType: "N",
    },
  ],
  KeySchema: [
    {
      AttributeName: "Id",
      KeyType: "HASH",
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
};
//documentClient dont support creation of Table

dynamodb.createTable(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Result**

```js
{
  TableDescription: {
    AttributeDefinitions: [ [Object] ],
    TableName: 'itemOps',
    KeySchema: [ [Object] ],
    TableStatus: 'CREATING',
    CreationDateTime: 2021-07-01T12:28:34.328Z,
    ProvisionedThroughput: {
      NumberOfDecreasesToday: 0,
      ReadCapacityUnits: 0,
      WriteCapacityUnits: 0
    },
    TableSizeBytes: 0,
    ItemCount: 0,
    TableArn: 'arn:aws:dynamodb:ap-south-1:925122152599:table/itemOps',
    TableId: 'cbb73788-f3b4-4871-929d-8947858f57de',
    BillingModeSummary: { BillingMode: 'PAY_PER_REQUEST' }
  }
}
```

### Insert our JSON data

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Item: {
    Id: 123,
    Title: "Bicycle 123",
    Description: "123 description",
    BicycleType: "Hybrid",
    Brand: "Brand-Company C",
    Price: 500,
    Color: ["Red", "Black"],
    ProductCategory: "Bicycle",
    InStock: true,
    QuantityOnHand: null,
    RelatedItems: [341, 472, 649],
    Pictures: {
      FrontView: "http://example.com/products/123_front.jpg",
      RearView: "http://example.com/products/123_rear.jpg",
      SideView: "http://example.com/products/123_left_side.jpg",
    },
    ProductReviews: {
      FiveStar: [
        "Excellent! Can't recommend it highly enough! Buy it!",
        "Do yourself a favor and buy this.",
      ],
      OneStar: ["Terrible product! Do not buy this."],
    },
    Comment: "This product sells out quickly during the summer",
    "Safety.Warning": "Always wear a helmet",
  },
};

docClient.put(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

## Projection Expression

To read data from a table, you use operations such as `GetItem`, `Query`, or `Scan`. Amazon DynamoDB returns all the item attributes by default. To get only some, rather than all of the attributes, use a projection expression - From AWS Docs.

In Layman terms, you can call it as a selective picker which allows you to get only selective items that you need and prevents over fetching thus saving throughput and money.

### Lets get `Description`, `RelatedItems[0]`, `ProductReviews.FiveStar` with getItem

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "Description, RelatedItems[0], ProductReviews.FiveStar",
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
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

Sometime the Projection Expression will not work due to the reserved keywords in DynamoDB and there's around 573 as of now so its hard to keep track of all of these keywords and it's highly unlikely that you won't come across the Reserved Keywords error like below.

```bash
ValidationException: Invalid ProjectionExpression: Attribute name is a reserved keyword; reserved keyword: Comment
```

To really Understand why it exist, you can watch this video from [Tom Scott - Why You Can't Name A File CON In Windows](https://youtu.be/bC6tngl0PTI "Why You Can't Name A File CON In Windows") that will give you a rough idea of the purpose of reserved keywords in DynamoDB.

But anyways, it's always advisable to use `ExpressionAttributeNames` in combination with `ProjectionExpression`

To assign a `ExpressionAttributeNames` variable using `#` keyword
eg:

- `#YT`
- `#c`
- `#name`

It can be any random variable.

#### So let's try to get an attribute `Comment` from our JSON date which is a reserved keyword

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "#c",
  ExpressionAttributeNames: {
    "#c": "Comment",
  },
  ReturnConsumedCapacity: "TOTAL",
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
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

## Attribute Names Containing Dots

Here we'll see the proper way to get `Safety.Warning` Attribute

if you used the below code then, you'll get empty results

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "Safety.Warning",
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Result**

```bash
{ Item: {} }
```

The reason for this is because DynamoDB treats `Safety.Warning` as

```js
Safety: {
    Warning: {...}
}
```

To get arround this issue, use `ExpressionAttributeNames` as below

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "#sw",
  ExpressionAttributeNames: {
    "#sw": "Safety.Warning",
  },
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Result**

```bash
{ Item: { 'Safety.Warning': 'Always wear a helmet' } }
```

## Nested Attributes

Now how to get a nested attribute `ProductReviews.OneStar`?

**1st way**

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "ProductReviews.OneStar",
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**2nd way**

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "#pr.#1star",
  ExpressionAttributeNames: {
    "#pr": "ProductReviews",
    "#1star": "OneStar",
  },
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Both returns the same results as below**

```js
{
  Item: {
    ProductReviews: {
      OneStar: [Array];
    }
  }
}
```

## Repeating Attribute Names

Let say you want to get these three attribute `ProductReviews.FiveStar`, `ProductReviews.ThreeStar`, `ProductReviews.OneStar`.

so Instead of using this,

```js
ProjectionExpression: "ProductReviews.FiveStar, ProductReviews.ThreeStar, ProductReviews.OneStar";
```

you can reduce it down to below

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "itemOps",
  Key: {
    Id: 123,
  },
  ProjectionExpression: "#pr.FiveStar, #pr.ThreeStar, #pr.OneStar",
  ExpressionAttributeNames: {
    "#pr": "ProductReviews",
  },
};

docClient.get(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Result**

```js
{ Item: { ProductReviews: { FiveStar: [Array], OneStar: [Array] } } }
// There's no ThreeStar attribute because it doesn't exist in our JSON file
```

## Expression Attribute Values

In case of `ProjectionAttribute` what we saw that to assign any variable, we use `#`symbol. Now for defining value `':'` is used.

eg. :

- `:c`
  - `":c": { "S": "Black" },`
- `:p`
  - `":p": { "N": "500" }`

We'll see how to use Expression Attribute as we go along to use the update Expression.

## Condition Expressions

Consider it as a checking mechanism when you a `put`, `update` or `delete` request to know if that attribute exist or not.

### List of all Condition Expression

- `attribute_exists`
- `attribute_not_exists`
- `attribute_type`
- `begins_with`
- `contains`
- `size`

For more info over these five expression [see this](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html#Expressions.OperatorsAndFunctions.Functions "functions")

But lets understand it in short.

**1. attribute_exists** :
By specifying this attribute, you say to DynamoDB, "hey, do this `put` operation if this item exist.

**2. attribute_not_exists** :
By specifying this attribute, you say to DynamoDB, "hey, do this `put` operation only if this item does not exist.

**3. attribute_type** : This one is used to check/validate the type of attribute.

**4. begin_with** : Check whether the first few characters of the front view picture URL are `http://` or any character as you want.

**5. contains** : Check whether the Brand attribute contains the substring Company.

**6. size** : Returns the size of attribute.

### Conditional Put in Javascript

I've created a table name 'email' with Partition/Primary Key as email (string) and as of now, it's empty so, lets try to do a conditional put of

**`1. attribute_exists`** for an fictional email abc@example.com

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "email",
  Item: {
    email: "abc@example.com",
    data: "this is a random data",
  },
  ConditionExpression: "attribute_exists(email)",
};

docClient.put(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Result**

```bash
ConditionalCheckFailedException: The conditional request failed
```

2. Now, lets do the same for **`attribute_not_exists`**

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "email",
  Item: {
    email: "abc@example.com",
    data: "this is a random data",
  },
  ConditionExpression: "attribute_not_exists(email)",
};

docClient.put(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

**Result**

```bash
{} --> Result is blank but I can confirm it was uploaded to my DynamoDB Table.
```

same goes for `update` and `delete` operation

## Comparison Operator and Function Reference

- `a = b` — true if a is equal to b

- `a <> b` — true if a is not equal to b

- `a < b` — true if a is less than b

- `a <= b` — true if a is less than or equal to b

- `a > b` — true if a is greater than b

- `a >= b` — true if a is greater than or equal to b

These operators are utmost helpful in filter expression.

## Update Expressions

- `SET`
- `REMOVE`
- `ADD`
- `DELETE`

### `SET`

1. Let say you have this data in your table and you want a add an year,

| email           | data                  |
| --------------- | --------------------- |
| abc@example.com | this is a random data |

here's how to do it,

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "email",
  Key: {
    email: "abc@example.com",
  },
  ExpressionAttributeNames: {
    "#y": "Year",
  },
  ExpressionAttributeValues: {
    ":y": 2021,
  },
  UpdateExpression: "SET #y = :y ",
};

docClient.update(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

Year is a reserved keyword hence we've used `ExpressionAttributeNames`

**Result**
| email | data | Year |
|-----------------|-----------------------|------|
| abc@example.com | this is a random data | 2021 |

### `ADD`

There are two way to add a number. You can either use `SET` or `ADD` but AWS docs [recommends](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.ADD "ADD—Updating Numbers and Sets") to always use `SET`

But first let see how to use `ADD` UpdateExpression to add the number in year

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "email",
  Key: {
    email: "abc@example.com",
  },
  ExpressionAttributeNames: {
    "#y": "Year",
  },
  ExpressionAttributeValues: {
    ":y": 2021,
  },
  UpdateExpression: "ADD #y :y",
};

docClient.update(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

Now lets see how to use `SET` operator

```js
// Just change the UpdateExpression in above example as per following
UpdateExpression: "SET #y= #y + :y";
```

**DynamoDB only supports addition and substraction natively. Inorder to do other math operations you have to implement your own logic.**

### REMOVE

If we want to delete our attribute `Year`, this is the way

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

var params = {
  TableName: "email",
  Key: {
    email: "abc@example.com",
  },
  ExpressionAttributeNames: {
    "#y": "Year",
  },
  UpdateExpression: "REMOVE #y", //<------
};

docClient.update(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```

### `DELETE`

I'd say dont use `DELETE`as `REMOVE` works way efficiently and compared to remove, delete only clear top level sets of an item.

## FilterExpression

Now at last, let's see some examples of `FilterExpression` in action with query which will utilise all the above concepts.

```js
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

const params = {
  TableName: "covid-data",
  ExpressionAttributeNames: {
    "#location": "location",
    "#c": "continent",
    "#si": "stringency_index",
  },
  ExpressionAttributeValues: {
    ":location": "Afghanistan",
    ":c": "Asia",
    ":lv": "10",
    ":hv": "13",
  },
  IndexName: "GSI",
  KeyConditionExpression: "#location = :location AND #c = :c",
  FilterExpression: "#si > :lv AND #si < :hv",
  ConsistentRead: false,
};
docClient.query(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
```
