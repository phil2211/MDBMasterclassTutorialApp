exports = async ({startRow, endRow, filterModel, searchText}) => {
  const isEmpty = require("lodash/isEmpty");
  const cluster = context.services.get("mongodb-atlas");
  //const collection = cluster.db("MyCustomers").collection("customerSingleViewMultiAddress");
  const collection = cluster.db("MyCustomers").collection("customerSingleView");
  
  const agg = [];
  
  if(!isEmpty(searchText)) {
    //return await collection.aggregate(context.functions.execute("getMultiaddressSearchStage", {searchText, startRow, endRow})).next();
    return await collection.aggregate(context.functions.execute("getEnhancedSearchStage", {searchText, startRow, endRow})).next();
  }
  
  if(!isEmpty(filterModel)) {
    agg.push(context.functions.execute('getFilterStage', filterModel));
  }
  
  agg.push({
    $facet: {
      rows: [{"$skip": startRow?startRow:0}, {"$limit": endRow-startRow?endRow-startRow:2000}],
      rowCount: [{$count: 'lastRow'}]
    }
  });
  
  agg.push({
    $project: {
      rows: 1,
      query: JSON.stringify(agg, null, ' '),
      lastRow: {"$ifNull": [{$arrayElemAt: ["$rowCount.lastRow", 0]}, 0]}
    }
  });

  return await collection.aggregate(agg).next();
}

/*********
* TestData 
**********
const startRow = 0;

const endRow = 50;

const filterModel = 
[
  {
    "filterField": "age",
    "filterType": "number",
    "operator": "AND",
    "condition1": {
      "filterType": "number",
      "type": "lessThan",
      "filter": 60
    },
    "condition2": {
      "filterType": "number",
      "type": "greaterThan",
      "filter": 20
    }
  }
]

exports({startRow, endRow, filterModel});
*/