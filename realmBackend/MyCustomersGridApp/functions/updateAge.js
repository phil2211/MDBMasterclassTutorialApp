exports = function() {
  const collection = context.services.get("mongodb-atlas").db("MyCustomers").collection("customerSingleView");
  const doc = collection.updateMany(
    {},
    [{
      $set: 
      {
        "age": {
            "$subtract": [
                {"$subtract": [{"$year": "$$NOW"}, {"$year": "$birthdate"}]},
                {"$cond": [
                    {"$gt": [0, {"$subtract": [{"$dayOfYear": "$$NOW"},{"$dayOfYear": "$birthdate"}]}]},
                    1,
                    0
                ]}
            ]
        }
      }
    }]
  );
  
  return doc;
}