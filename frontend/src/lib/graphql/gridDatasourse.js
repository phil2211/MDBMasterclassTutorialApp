import { gql } from "@apollo/client";
import { forEach } from "lodash";

export const createServerSideDatasource = ({ client, searchText }) => {
    return {
      getRows: ({ request, successCallback, failCallback }) => {
        console.log(request);
        const { startRow, endRow, filterModel } = request;
        const aFilterModel = [];
        forEach(filterModel, (value, key) => {
          aFilterModel.push({ filterField: key, ...value});
        });
        console.log(aFilterModel);
            const query = { 
                query: gql`
                query gridDataWithInput($queryInput:GridQueryModel) { 
                  getGridData(input:$queryInput) {
                      lastRow
                      query
                      rows {
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
                  }
                `,
              variables: {
                "queryInput": {
                    startRow,
                    endRow,
                    filterModel: aFilterModel,
                    searchText
                  }
                }
            };

            client.query(query)
                .then(res => {
                    return (res.data.getGridData);
                })
              .then(({ lastRow, rows }) => {
                successCallback(rows, lastRow)
            })
            .catch(err => {
                console.error(err);
                failCallback();
            })
        }
    }
}