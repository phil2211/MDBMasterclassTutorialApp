exports = ({searchText, startRow, endRow}) => {
  const split = require("lodash/split");
  const trim = require("lodash/trim");

  const tSearchText = trim(searchText);
  const aSearchText = split(tSearchText, ' ', 5);
  
  return [
{$search: {
  index: 'multiAddress',
  compound: {
    should: [{
      wildcard: {
        path: 'customerId',
        allowAnalyzedField: true,
        query: aSearchText[0]
      }
    }, {
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
            embeddedDocument: {
              path: 'addresses',
              operator: {
                autocomplete: {
                  query: tSearchText,
                  path: 'addresses.street'
                }
              }
            }
          },
          {
            embeddedDocument: {
              path: 'addresses',
              operator: {
                autocomplete: {
                  query: tSearchText,
                  path: 'addresses.city'
                }
              }
            }
          },
          {
            embeddedDocument: {
              path: 'addresses',
              operator: {
                autocomplete: {
                  query: tSearchText,
                  path: 'addresses.country'
                }
              }
            }
          },
          {
            embeddedDocument: {
              path: 'addresses',
              operator: {
                text: {
                  query: tSearchText,
                  path: 'addresses.zip'
                }
              }
            }
          },
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
        }, {
          autocomplete: {
            path: 'firstName',
            query: tSearchText,
            score: {
              boost: {
                value: 3
              }
            }
          }
        }, {
          autocomplete: {
            path: 'address.street',
            query: tSearchText
          }
        }, {
          autocomplete: {
            path: 'address.city',
            query: tSearchText
          }
        }, {
          autocomplete: {
            path: 'address.country',
            query: tSearchText
          }
        }],
        minimumShouldMatch: aSearchText.length
      }
    }],
    minimumShouldMatch: 1
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