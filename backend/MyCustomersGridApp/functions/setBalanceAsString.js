exports = function({documentKey}) {
  const collection = context.services
    .get("mongodb-atlas")
    .db("MyCustomers")
    .collection("customerSingleView");
    
  collection.updateOne(
    {_id: documentKey._id},
    [{"$set": {"totalBalanceString": {"$toString": "$totalBalance"}}}]
  );
}