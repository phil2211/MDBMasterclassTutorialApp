import { gql } from "@apollo/client";

export const createServerSideDatasource = ({ client }) => {
    return {
        getRows: (params) => {
            const query = { 
                query: gql`
                query {
                    customerSingleViews (
                      query: {
                        age_gte:"20"
                        address: {
                          country:"Switzerland"
                        }
                      }
                    ) {
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
                  }`
            };

            client.query(query)
                .then(res => {
                    return (res.data.customerSingleViews);
                })
                .then((rows) => {
                params.successCallback(rows)
            })
            .catch(err => {
                console.error(err);
                params.failCallback();
            })
        }
    }
}