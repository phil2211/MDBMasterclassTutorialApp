exports = (filterModel) => {
  const forEach = require("lodash/forEach");
  const toLower = require("lodash/toLower");
  
  // maps to this https://www.ag-grid.com/javascript-data-grid/filter-provided-simple/#simple-filter-options
  const typeMap = {
    "equals": "$eq",
    "notEqual": "$ne",
    "contains": "$regex",
    "notContains": "$regex",
    "startsWith": "$regex",
    "endsWith": "$regex",
    "lessThan": "$lt",
    "lessThanOrEqual": "$lte",
    "greaterThan": "$gt",
    "greaterThanOrEqual": "$gte"
  };
  
  //initialise match stage
  const filterStage = {"$match": {"$and": []}};

  forEach(filterModel, (value) => {
    if (value.filter) {
      filterStage.$match.$and.push({[value.filterField]: {[typeMap[value.type]]: getFilterValue(value.type, value.filter)}});  
    } else {
      const operator = `$${toLower(value.operator)}`;
      filterStage.$match.$and.push(
        {[operator]: [
          {[value.filterField]: {[typeMap[value.condition1.type]]: getFilterValue(value.condition1.type, value.condition1.filter)}},
          {[value.filterField]: {[typeMap[value.condition2.type]]: getFilterValue(value.condition2.type, value.condition2.filter)}}
        ]}
      )
    }
    
  });
  
  return filterStage;
};


const getFilterValue = (type, filter) => {
  switch (type) {
    case "contains": 
      return `.*${filter}.*`;
    case "notContains":
      return `^((?!${filter}).)*$`;
    case "startsWith":
      return `^${filter}`;
    case "endsWith":
      return `${filter}$`;
    case "greaterThan":
    case "greaterThanOrEqual":
    case "lessThan":
    case "lessThanOrEqual":
      return Number(filter);
    default: 
      return filter;
  }
}

/*********
* TestData 
**********
const filterModel = 
[
        {
            "filterField": "address.country",
            "filterType": "text",
            "operator": "OR",
            "condition1": {
                "filterType": "text",
                "type": "notContains",
                "filter": "Swiss"
            },
            "condition2": {
                "filterType": "text",
                "type": "contains",
                "filter": "land"
            }
        },
        {
            "filterField": "age",
            "filterType": "number",
            "type": "greaterThan",
            "filter": 20
        }
    ]


exports(filterModel);
*/