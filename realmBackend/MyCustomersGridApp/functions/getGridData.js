exports = async (params) => {
  const isEmpty = require("lodash/isEmpty");
  console.log(JSON.stringify(params))
  const {startRow, endRow, filterModel, searchText} = params;
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("MyCustomers").collection("customerSingleView");
  
  const agg = [];
  
  if(!isEmpty(searchText)) {
    return await collection.aggregate(context.functions.execute("getSearchStage", {searchText, startRow, endRow})).next();
  }
  
  if(!isEmpty(filterModel)) {
    agg.push(context.functions.execute('getFilterStage', filterModel));
  }
  
  agg.push({
    $facet: {
      rows: [{"$skip": startRow}, {"$limit": endRow-startRow}],
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