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

const Grid = ({ client }) => {
    const app = useRealmApp();
    const [user] = useState(app.currentUser);
    
    const [columnDefs] = useState([
        { field: "customerId" },
        { field: "lastName" },
        { field: "firstName" },
        { field: "age" },
        { field: "country", valueGetter: "data.address.country" },
        { field: "segment", valueGetter: "data.crmInformation.segmentation" },
        { field: "totalBalance" },
        { field: "totalContactsYtd", valueGetter: "data.crmInformation.totalContactsYtd" }
    ]);

    const onGridReady = (params) => {
        const datasource = createServerSideDatasource({ client })
        params.api.setServerSideDatasource(datasource);
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
                    rowModelType="serverSide"

                />
            </div>
            <div style={{margin: 10}}>
            <p>User: {user.id ? `${user.profile.email} (${user.providerType})` : "not logged in"}</p>
            <Button variant="primary" onClick={() => app.logOut()}>Logout</Button>
        </div>

        </>
    )
}

export default apolloClientConsumer(Grid);