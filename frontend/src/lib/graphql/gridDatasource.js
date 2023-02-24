import { gql } from "@apollo/client";

export const updateAccount = ({ client, accountNumber, amount }) => {
  const query = {
    query: gql`
    mutation($accountNumber:String, $amount:Int) {
      updateAccountBalance(input: {
        accountNumber:$accountNumber,
        amount:$amount
      }) {
        aknowledge
      }
    }
    `,
    variables: {
      accountNumber,
      amount
    }
  };
  

  client.query(query)
    .then((res) => {
      console.log(res)
    })
    .catch(err => console.error(err));
}

export const createServerSideDatasource = ({ client, searchText }) => {
    return {
      getRows: ({ request, successCallback, failCallback }) => {
        //console.log(request);
        const { startRow, endRow, sortModel } = request;
            const query = { 
                query: gql`
                query (
                  $startRow: Int,
                  $endRow: Int,
                  $sortModel: [GridQueryModelSortModel],
                  $searchText: String
                ) { 
                  getGridData(input: {
                    startRow: $startRow,
                    endRow: $endRow,
                    sortModel: $sortModel,
                    searchText: $searchText
                  }) {
                      lastRow
                      query
                      rows {
                        _id
                        age
                        revision
                        customerId
                        firstName
                        lastName
                        totalBalance
                        address {
                          street
                          city
                          country
                        }
                        accounts {
                          balance
                          description
                          number
                          type
                        }
                        crmInformation {
                          segmentation
                          totalContactsYtd
                        }
                      }
                    }
                  }
                `,
              variables: {
                  startRow,
                  endRow,
                  sortModel,
                  searchText
                }
            };
            client.query(query)
              .then((res) => {
                successCallback(res.data.getGridData.rows, res.data.getGridData.lastRow?res.data.getGridData.lastRow:0)
            })
            .catch(err => {
                console.error(err);
                failCallback();
            })
        }
    }
}