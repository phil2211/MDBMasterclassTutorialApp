'use strict';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';

let allRowData;

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '500px' }), []);
  const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    // group cell renderer needed for expand / collapse icons
    { field: 'name', cellRenderer: 'agGroupCellRenderer' },
    { field: 'account' },
    { field: 'calls' },
    { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);
  const getRowId = useCallback(function (params) {
    return params.data.account;
  }, []);
    
  const detailCellRendererParams = useMemo(() => {
    return {
      refreshStrategy: 'rows',
      template: (props) => (
        <div class="ag-details-row ag-details-row-fixed-height">
          <div style="padding: 4px; font-weight: bold;">
            {props.data.name} {props.data.calls} calls
          </div>
          <div
            ref="eDetailGrid"
            class="ag-details-grid ag-details-grid-fixed-height"
          />
        </div>
      ),
      detailGridOptions: {
        rowSelection: 'multiple',
        enableCellChangeFlash: true,
        getRowId: (params) => {
          return params.data.callId;
        },
        columnDefs: [
          { field: 'callId', checkboxSelection: true },
          { field: 'direction' },
          { field: 'number', minWidth: 150 },
          { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
          { field: 'switchCode', minWidth: 150 },
        ],
        defaultColDef: {
          flex: 1,
          sortable: true,
        },
      },
        getDetailRowData: (params) => {
        console.log("DETAIL")
        // params.successCallback([]);
        params.successCallback(params.data.callRecords);
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/master-detail-data.json')
      .then((resp) => resp.json())
      .then((data) => {
        allRowData = data;
        setRowData(data);
      });
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    // arbitrarily expand a row for presentational purposes
    setTimeout(function () {
      gridRef.current.api.getDisplayedRowAtIndex(0).setExpanded(true);
    }, 0);
    setInterval(function () {
      if (!allRowData) {
        return;
      }
      const data = allRowData[0];
      const newCallRecords = [];
      data.callRecords.forEach(function (record, index) {
        newCallRecords.push({
          name: record.name,
          callId: record.callId,
          duration: record.duration + (index % 2),
          switchCode: record.switchCode,
          direction: record.direction,
          number: record.number,
        });
      });
      data.callRecords = newCallRecords;
      data.calls++;
      const tran = {
        update: [data],
      };
        gridRef.current.api.applyTransaction(tran);
    }, 2000);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            masterDetail={true}
            animateRows={true}
            enableCellChangeFlash={true}
            detailCellRendererParams={detailCellRendererParams}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
      </div>
    </div>
  );
};

//render(<GridExample></GridExample>, document.querySelector('#root'));

export default GridExample;