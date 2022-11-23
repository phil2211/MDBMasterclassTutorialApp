exports = async ({startRow, endRow}) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("MyCustomers").collection("customerSingleView");
  
  const agg = []
  
  agg.push({
    $search: {
        index: 'customEnhanced',
        range: {
            path: 'age',
            gte: 0,
            lte: 100
        }
    }
  });
  
  agg.push({
    '$skip': startRow
  });
  
  agg.push({
    '$limit': endRow-startRow
  });
  
  agg.push({
    $group: {
        _id: '$$SEARCH_META',
        rows: {
            $push: '$$CURRENT'
        }
    }
  });
  
  agg.push({
    $project: {
        _id: 0,
        lastRow: '$_id.count.lowerBound',
        rows: 1
    }
  })
  return await collection.aggregate(agg).next();
}

/*********
* TestData 
**********
exports({startRow:0, endRow:5});
*/