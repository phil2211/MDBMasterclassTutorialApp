import { gql } from "@apollo/client";

export const createServerSideDatasource = ({ client, searchText='' }) => {
    return {
        getRows: (params) => {
            console.log(params, searchText);
            const { startRow, endRow, rowGroupCols, groupKeys, valueCols, sortModel } = params.request;
            sortModel.map(model => model.sort = model.sort.toUpperCase());

            const query = { 
                query: gql`
                    query getGridData($queryModelInput:GridQueryModel) {
                        getGridData(input: $queryModelInput) {
                            lastRow
                            query
                            rows {
                                customerId
                                lastName
                                firstName
                                age
                                totalBalance
                                address {
                                    country
                                }
                                crmInformation {
                                    segmentation
                                    totalContactsYtd
                                }
                                accounts {
                                    balance
                                    name
                                    number
                                    type
                                }
                            }
                        }
                    }
                `,
                variables: {
                    "queryModelInput" : {
                        startRow,
                        endRow,
                        rowGroupCols,
                        groupKeys,
                        valueCols,
                        sortModel,
                        searchText
                    }
                }
            };

            client.query(query)
            .then(res => res.data.getGridData)
            .then(({ lastRow, rows }) => {
                params.successCallback(rows, lastRow)
            })
            .catch(err => {
                console.error(err);
                params.failCallback();
            })
        }
    }
}