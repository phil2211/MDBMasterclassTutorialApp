import React, { useState, useEffect, Component } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { debounce, forEach, get } from "lodash";
import { useRealmApp } from "../RealmApp";
import Header from "../Components/Header";
import { createServerSideDatasource } from "../lib/graphql/gridDatasourse";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";

const formatCurrency = (params) => {
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(params.value);
}

const formatNumber = (value) => {
    return new Intl.NumberFormat('de-DE').format(value);
}

const Grid = ({ client }) => {
    const app = useRealmApp();
    const [user] = useState(app.currentUser);
    const [totalRows, setTotalRows] = useState(0)
    const [searchText, setSearchText] = useState('');
    const [gridApi, setGridApi] = useState(null);
    const [customerSingleView, setCustomerSingleView] = useState(null);

    const dbSetSearchText = debounce(setSearchText, 500);
    
    const [columnDefs] = useState([
        { field: "customerId", cellRenderer: "agGroupCellRenderer" },
        { field: "lastName" },
        { field: "firstName" },
        {
            field: "age",
            filter: "agNumberColumnFilter",
            type: 'numericColumn',
            sortable: true
        },
        {
            field: "street",
            colId: "address.country",
            filter: 'agTextColumnFilter',
            valueGetter: "data.address.street"
        },
        {
            field: "city",
            colId: "address.country",
            filter: 'agTextColumnFilter',
            valueGetter: "data.address.city"
        },
        {
            field: "country",
            colId: "address.country",
            filter: 'agTextColumnFilter',
            valueGetter: "data.address.country"
        },
        {
            field: "segment",
            valueGetter: "data.crmInformation.segmentation"
        },
        {
            field: "totalBalance",
            valueFormatter: formatCurrency,
            filter: "agNumberColumnFilter",
            type: 'numericColumn',
            cellRenderer: "agAnimateShowChangeCellRenderer",
            enableValue: true
        },
        {
            field: "totalContactsYtd",
            colId: "crmInformation.totalContactsYtd",
            valueGetter: "data.crmInformation.totalContactsYtd",
            type: 'numericColumn',
            sortable: true
        }
    ]);

    const detailColumnDefs = [
        { field: "number" },
        { field: "description" },
        { field: "type" },
        { field: "balance" }
    ]

    useEffect(() => {
        if (gridApi) {
            onGridReady(gridApi, searchText);
        }
    }, [searchText]);

    const onGridReady = async (params, searchText) => {
        //const result = await app.currentUser.functions.test("error");
        //console.log("RESULT", result);
        const mongo = app.currentUser.mongoClient("mongodb-atlas");
        const customerSingleView = mongo.db("MyCustomers").collection("customerSingleView");
        setCustomerSingleView(customerSingleView);    
        setGridApi(params);
        params.api.sizeColumnsToFit();
        const datasource = createServerSideDatasource({ searchText, currentUser: app.currentUser })
        params.api.setServerSideDatasource(datasource);
        for await (const change of customerSingleView.watch({
            filter: {
                operationType: "update",
               "updateDescription.updatedFields.totalBalance": {"$exists": true}
            }
        })) {
            params.api.forEachNode(rowNode => {
                if (get(change, 'documentKey._id', '').toString() === get(rowNode, 'data._id', '').toString()) {
                    forEach(change.updateDescription.updatedFields, (value, field) => {
                        rowNode.setDataValue(field, value.toString());
                    })
                }
           }) 
        }
    }

    const onModelUpdated = (params) => {
        setTotalRows(params.api.getDisplayedRowCount());
    }

    return (
        <>
            <Header />
            <div style={ {marginBottom: 10, width: 500} }>
                <TextInput
                    autoComplete="off"
                    aria-label="enter search text"
                    type="search"
                    placeholder="Search"
                    onChange={event => dbSetSearchText(event.target.value)}
                    />
            </div>
            <div         
                style={{ height: "calc(100vh - 280px)" }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    onModelUpdated={onModelUpdated}
                    onFilterChanged={() => gridApi.api.refreshServerSideStore()}
                    rowModelType="serverSide"
                    serverSideStoreType="partial"
                    cacheBlockSize={20}
                    maxBlocksInCache={5}
                    masterDetail={ true }
                    detailCellRendererParams={{
                        refreshStrategy: 'rows',
                        getDetailRowData: (params) => {
                            console.log("DETAILS")
                            params.successCallback(() => {
                                return params.data.accounts;
                            })
                        },
                        detailGridOptions: {
                            getRowId: (params) => {
                                return params.data.number;
                            },  
                            columnDefs: detailColumnDefs
                        }
                    }}    
                />
            </div>
            <div style={{ margin: 10 }}>
                <p>{`Total Results: ${formatNumber(totalRows)}`}</p>
            <p>User: {user.id ? `${user.profile.email} (${user.providerType})` : "not logged in"}</p>
            <Button variant="primary" onClick={() => app.logOut()}>Logout</Button>
        </div>

        </>
    )
}

export default Grid;


export class BtnCellRenderer extends Component {
    constructor(props) {
      super(props);
      this.btnDepositHandler = this.btnDepositHandler.bind(this);
      this.btnWithdrawHandler = this.btnWithdrawHandler.bind(this);
    }
    btnDepositHandler() {
        this.props.clicked(this.props.data.number, "deposit");
    }
    btnWithdrawHandler() {
        this.props.clicked(this.props.data.number, "withdraw");
    } 
    render() {
        return (
          <>
                <button style={{marginRight: 10}} onClick={this.btnDepositHandler}>Deposit</button>
                <button onClick={this.btnWithdrawHandler}>Withdraw</button>
          </>
      )
    }
}


const tokenizer = (dotString) => {
    const result = {};

    // Split path into component parts
    const parts = dotString.split('.');

    // Create sub-objects along path as needed
    let target = result;
    while (parts.length > 1) {
        const part = parts.shift();
        target = target[part] = target[part] || {};
    }

    // Set value at end of path
    target[parts[0]] = dotString
  
    return result;
}