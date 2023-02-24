exports = function(changeEvent) {
  const mongodb = context.services.get("mongodb-atlas");
  const db = mongodb.db("MyCustomers");
  const historyCollection = db.collection("customersHistory");
  const collection = db.collection("customerSingleView");
  let { documentKey, fullDocument, fullDocumentBeforeChange, updateDescription, operationType } = changeEvent;
  
  //create initial revision if document was created before introduction of historization
  if (fullDocumentBeforeChange.revision === undefined) {
    fullDocumentBeforeChange.revision = 0;
    fullDocumentBeforeChange.originId = documentKey._id;
    fullDocumentBeforeChange.validFrom = new Date(0);
  }
  
  //remove _id to let MongoDB create a new unique ObjectId for history document
  delete fullDocumentBeforeChange._id;
  //terminate validity of history document and set option updateDescription
  fullDocumentBeforeChange.validUntil = new Date();
  fullDocumentBeforeChange.updateDescription = updateDescription;
  fullDocumentBeforeChange.operationType = operationType;
  
  //update original document to increment revision and set validFrom and originId 
  //if document was never touched for historization
  collection.updateOne({_id: documentKey._id},
      { 
        $set: {"validFrom": new Date(), "originId": documentKey._id},
        $inc: {"revision": 1}
      }
  )
  //on success, write history document
  .then(result => {
    console.log(`Successfully updated document with _id: ${documentKey._id}`);
    historyCollection.insertOne(fullDocumentBeforeChange)
      .then(result => console.log(`Successfully created history document with _id: ${result.insertedId}`))
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
  return true;
};