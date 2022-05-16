// @ts-nocheck
import React from 'react'
import {AgGridReact} from 'ag-grid-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CustomMuiFooter from './CustomMuiFooter';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

// const rowStyle = {};

function Tabela(props) {
  return (
    <ThemeProvider theme={darkTheme}>
    <div style={{ height: props.height ? props.height : 631, width: '100%' }}>
      <DataGrid rowHeight={props.rowHeight ? props.rowHeight : 52} className='table' rows = {props.rows} columns = {props.columns}
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
    </div>
    </ThemeProvider>
  ) 
}
export default Tabela;