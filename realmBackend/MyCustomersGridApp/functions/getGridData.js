exports = async (params) => {
  console.log(JSON.stringify(params))
  const {startRow, endRow} = params;
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("MyCustomers").collection("customerSingleView");
  
  return await collection.find({}).skip(startRow).limit(endRow-startRow).toArray()
}


/*
Testdata

exports({
  startRow: 0,
  endRow: 20
})

*/