const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
	region: 'ap-south-1'
});

var params = {
    Item:{
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
     },
     ReturnConsumedCapacity: "TOTAL", 
  TableName: "itemOps"
}

docClient.put(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
    data = {
     ConsumedCapacity: {
      CapacityUnits: 1, 
      TableName: "Music"
     }
    }
    */
  });