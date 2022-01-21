const columnTypes = {
    detail: {
        enableRowGroup: false,
        enablePivot: false
    },
    dimension: {
        enableRowGroup: true,
        enablePivot: true
    },
    fact: {
        aggFunc: "sum",
    }
};

const sideBar = {
    toolPanels: [
        {
            id: "columns",
            labelDefault: "Columns",
            toolPanel: "agColumnsToolPanel"
        }
    ]
}

const rowGroupPanelShow = "always";

const groupDisplayType = "multipleColumns";

const defaultColDef = {
    sortable: true,
    resizable: true
}

const onSortChanged = (params) => {
    params.api.refreshServerSideStore({purge: true});
}

const rowSelection = "single";
const rowModelType = "serverSide";
const serverSideStoreType = "partial";
const cacheBlockSize = 50;
const maxConcurrentDatasourceRequests = 5;
const rowBuffer = 100;


export default {
    columnTypes,
    defaultColDef,
    rowSelection,
    rowModelType,
    serverSideStoreType,
    cacheBlockSize,
    rowGroupPanelShow,
    groupDisplayType,
    onSortChanged,
    maxConcurrentDatasourceRequests,
    rowBuffer
    //sideBar
}