exports = ({ searchText, startRow, endRow, sortModel }) => {
  const split = require("lodash/split");
  const trim = require("lodash/trim");

  const tSearchText = trim(searchText);
  const aSearchText = split(tSearchText, ' ', 5);
  
  const must = [
          {compound: {
           should: [
            {autocomplete: {
              query: tSearchText,
              path: "lastName"
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
       }]; 
       
  
  must.push(context.functions.execute('getSearchSortModel', sortModel));
  
       
  const search = []    
  search.push(
    {$search: {
       index: "customEnhanced",
       compound: {
         must
       }
    }});
  
  search.push(
      {$set: {
      score: {$meta: 'searchScore'}
    }}  
  );
  
  search.push(
    {$skip: startRow}  
  );
  
  search.push(
    {$limit: endRow-startRow}  
  );
  
  search.push({
    $group: {
        _id: '$$SEARCH_META',
        rows: {
            $push: '$$CURRENT'
        }
    }
  });
  
  search.push({
    $project: {
        _id: 0,
        lastRow: '$_id.count.lowerBound',
        query: JSON.stringify(search),
        rows: 1
    }
  })

  return search;
}

/*

const sortModel=[
  {
    "sort": "desc",
    "colId": "age"
  }
];

const startRow = 0;

const endRow = 5;

const searchText = "Rizzo"

exports({sortModel, startRow, endRow, searchText})

*/