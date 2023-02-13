// @ts-nocheck
'use client';

import React from 'react'
import DataGrid from './DataGrid.tsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CustomMuiFooter from './CustomMuiFooter';



// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import 'ag-grid-community/dist/styles/ag-theme-material.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

// const rowStyle = {};

export default function Tabela(props) {
  // const darkTheme = createTheme({
  //   palette: {
  //     mode: 'dark',
  //   },
  // });
  return (
    // <ThemeProvider theme={darkTheme}>
    // <div style={{ height: props.height ? props.height : 631, width: '100%' }}>
      <DataGrid rowHeight={props.rowHeight ? props.rowHeight : 52} className='table' rows = {props.rows} columns = {props.columns} getRowClassName={props.getRowClassName ? props.getRowClassName : null}
      disableSelectionOnClick={true}
        pageSize={props.pageSize ? props.pageSize : 10}
        rowsPerPageOptions={[10]}
        components={{
          Footer: CustomMuiFooter,
        }}
        componentsProps={{
          footer: { subtitle : props.subtitle ? props.subtitle : '' },
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'black',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          }}}
        />
    // </div>
    // </ThemeProvider>
  ) 
}