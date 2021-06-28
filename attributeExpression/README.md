# Specifying Item Attributes When Using Expressions

## JSON sample for this module

```js
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