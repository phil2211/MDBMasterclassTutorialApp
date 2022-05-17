exports = ({searchText, startRow, endRow}) => {
  return [
    {$search: {
       index: 'default',
       text: {
        query: searchText,
        path: [
         'lastName',
         'address.country'
        ],
        fuzzy: {
         maxEdits: 1
        }
       }
    }}, 
    {$set: {
       score: {
        $meta: 'searchScore'
       }
    }},
    {$facet: {
       rows: [
        {
         $skip: startRow
        },
        {
         $limit: endRow-startRow
        }
       ],
       lastRow: [
        {
         $replaceWith: '$$SEARCH_META'
        },
        {
         $limit: 1
        }
       ]
    }}, 
    {$set: {
       lastRow: {
        $arrayElemAt: [
         '$lastRow.count.lowerBound',
         0
        ]}
    }}
  ]
}