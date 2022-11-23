exports = function(sortModel) {
  const get = require("lodash/get");
  const mongoSearchSortObject = {
    "near": {
      "path": get(sortModel[0], "colId", "age"),
      "origin": get(sortModel[0], "sort")==="desc" ? -999 : 999,
      "pivot": 1,
      "score": {
        "boost": {
          "value": sortModel.length > 0 ? 9999999 : 0.000001
        }
      }
    }
  }
  return mongoSearchSortObject;
};

/*
Testdata
========
const sortModel=[
  {
    "sort": "DESC",
    "colId": "accounts.balance"
  }
]

exports(sortModel)
*/