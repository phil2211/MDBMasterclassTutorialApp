exports = ({searchText, startRow, endRow, sortModel}) => {
  const split = require("lodash/split");
  const trim = require("lodash/trim");

  const tSearchText = trim(searchText);
  const aSearchText = split(tSearchText, ' ', 5);
  
  return [
    {$search: {
       index: "default",
       compound: {
         should: [
          {autocomplete: {
            query: tSearchText,
            path: "lastName",
            fuzzy: {
              maxEdits: 1
            }
          }},
          {autocomplete: {
            query: tSearchText,
            path: "firstName"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "address.street"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "address.city"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "address.country"
          }},
          {text: {
            query: tSearchText,
            path: "customerId"
          }},
          {embeddedDocument: {
            path: "accounts",
            operator: {
              text: {
                query: tSearchText,
                path: "accounts.number"
              }
            }
          }}
        ],
        minimumShouldMatch: aSearchText.length
       }
    }}, 
    {$set: {
      score: {$meta: 'searchScore'}
    }},
    { $facet: {
        rows: [{ $skip: startRow }, { $limit: endRow-startRow }],
        lastRow: [{$replaceWith: "$$SEARCH_META"},{$limit: 1}]
    }}, 
    {$set: {
       lastRow: {"$ifNull": [{$arrayElemAt: ["$lastRow.count.lowerBound", 0]}, 0]}
    }}
  ]
}