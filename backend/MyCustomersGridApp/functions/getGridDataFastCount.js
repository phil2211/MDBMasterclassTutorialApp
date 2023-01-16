exports = async ({startRow, endRow, sortModel, searchText}) => {
  const isEmpty = require("lodash/isEmpty");
  const cluster = context.services.get("mongodb-atlas");
  //const collection = cluster.db("MyCustomers").collection("customerSingleViewMultiAddress");
  const collection = cluster.db("MyCustomers").collection("customerSingleView");
  
  const agg = []
  
  let operator = {};
  if (sortModel.length > 0) {
    operator = context.functions.execute('getSearchSortModel', sortModel)
  } else {
    operator = {
          'range': {
            'path': 'age', 
            'gte': 0, 
            'lte': 100
          }
        }
  }
  
  agg.push({
    '$search': {
      'index': 'customEnhanced', 
      'facet': {
        operator, 
        'facets': {
          'ageFacet': {
            'type': 'number', 
            'path': 'age', 
            'boundaries': [ 50,100 ]
          }
        }
      }
    }
  });
  
  agg.push({
    '$set': {
      'score': {
        '$meta': 'searchScore'
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

  if(!isEmpty(searchText)) {
    //return await collection.aggregate(context.functions.execute("getMultiaddressSearchStage", {searchText, startRow, endRow})).next();
    return await collection.aggregate(context.functions.execute("getEnhancedSearchStageFastCount", {searchText, startRow, endRow, sortModel})).next();
    //return await collection.aggregate(context.functions.execute("getEnhancedSearchStageSlowSort", {searchText, startRow, endRow, sortModel})).next();
  } else {
    return await collection.aggregate(agg).next();
  }
}

/*********
* TestData 
**********
const startRow = 0;

const endRow = 50;

const sortModel = [] 

exports({startRow, endRow, sortModel});
*/