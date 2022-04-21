import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@leafygreen-ui/button";
import { useRealmApp } from "../RealmApp";
import Header from "../Components/Header";
import { createServerSideDatasource } from "../lib/graphql/gridDatasourse";
import apolloClientConsumer from "../lib/graphql/apolloClientConsumer";

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
    
    const [columnDefs] = useState([
        { field: "customerId" },
        { field: "lastName" },
        { field: "firstName" },
        {
            field: "age",
            filter: "agNumberColumnFilter",
            type: 'numericColumn'
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
            type: 'numericColumn'
        },
        {
            field: "totalContactsYtd",
            valueGetter: "data.crmInformation.totalContactsYtd",
            type: 'numericColumn'
        }
    ]);

    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
        const datasource = createServerSideDatasource({ client })
        params.api.setServerSideDatasource(datasource);
    }

    const onModelUpdated = (params) => {
        setTotalRows(params.api.getDisplayedRowCount());
    }

    return (
        <>
            <Header />
            <div         
                style={{ height: "calc(100vh - 280px)" }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    onModelUpdated={onModelUpdated}
                    rowModelType="serverSide"
                    serverSideStoreType="partial"
                    cacheBlockSize={20}
                    maxBlocksInCache={5}
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

export default apolloClientConsumer(Grid);