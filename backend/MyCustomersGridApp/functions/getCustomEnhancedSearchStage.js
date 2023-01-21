exports = ({searchText, startRow, endRow}) => {
  const split = require("lodash/split");
  const trim = require("lodash/trim");
  const tSearchText = trim(searchText);
  const aSearchText = split(tSearchText, ' ', 5);
  const agg = [];
  
  agg.push(  {
   $search: {
    index: 'default',
    compound: {
     should: [
      {
       wildcard: {
        path: 'customerId',
        allowAnalyzedField: true,
        query: aSearchText[0]
       }
      },
      {
       embeddedDocument: {
        path: 'accounts',
        operator: {
         wildcard: {
          allowAnalyzedField: true,
          query: aSearchText[0],
          path: 'accounts.number'
         }
        }
       }
      },
      {
       compound: {
        should: [
         {
          autocomplete: {
           path: 'lastName',
           query: tSearchText,
           score: {
            boost: {
             value: 5
            }
           }
          }
         },
         {
          autocomplete: {
           path: 'firstName',
           query: tSearchText,
           score: {
            boost: {
             value: 3
            }
           }
          }
         },
         {
          autocomplete: {
           path: 'address.street',
           query: tSearchText
          }
         },
         {
          autocomplete: {
           path: 'address.city',
           query: tSearchText
          }
         },
         {
          autocomplete: {
           path: 'address.country',
           query: tSearchText
          }
         },
         {
           embeddedDocument: {
            path: 'accounts',
            operator: {
             autocomplete: {
              query: aSearchText[0],
              path: 'accounts.description'
             }
            }
           }
          }
        ],
        minimumShouldMatch: aSearchText.length
       }
      }
     ],
     minimumShouldMatch: 1
    }
   }
  });
    
  agg.push({$set: {
    score: {$meta: 'searchScore'}
  }});
  
  agg.push({ $facet: {
      rows: [{ $skip: startRow }, { $limit: endRow-startRow }],
      lastRow: [{$replaceWith: "$$SEARCH_META"},{$limit: 1}]
  }});
  
  agg.push({$set: {
     lastRow: {"$ifNull": [{$arrayElemAt: ["$lastRow.count.lowerBound", 0]}, 0]},   
     query: JSON.stringify(agg, " ", 2),
  }})
  return agg
}