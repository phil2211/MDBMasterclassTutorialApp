import { gql } from "@apollo/client";

export const createServerSideDatasource = ({ client }) => {
    return {
      getRows: ({ request, successCallback, failCallback }) => {
        const { startRow, endRow } = request;
            const query = { 
                query: gql`
                query gridDataWithInput($queryInput:GridQueryModel) { 
                  getGridData(input:$queryInput) {
                      age
                      customerId
                      firstName
                      lastName
                      totalBalance
                      address {
                        country
                      }
                      crmInformation {
                        segmentation
                        totalContactsYtd
                      }
                    }
                  }
                `,
              variables: {
                "queryInput": {
                    startRow,
                    endRow                  
                  }
                }
            };

            client.query(query)
                .then(res => {
                    return (res.data.getGridData);
                })
                .then((rows) => {
                successCallback(rows)
            })
            .catch(err => {
                console.error(err);
                failCallback();
            })
        }
    }
}