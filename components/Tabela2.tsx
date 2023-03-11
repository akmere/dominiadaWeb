// @ts-nocheck
// eslint-disable-next-line react-hooks/exhaustive-deps
"use client"
import React, { useEffect, useState } from 'react'
import '../styles/tabela.css'

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

  const getNodeText = node => {
    if (['string', 'number'].includes(typeof node)) return node
    if (node instanceof Array) return node.map(getNodeText).join('')
    if (typeof node === 'object' && node) return getNodeText(node.props.children)
  }

export default function Tabela2(props) {
    const tabelaRef = React.createRef();
    const rangeOfNumbers = (a : int,b : int) => b-a >= 0 ? [...Array(b+1).keys()].slice(a) : []
    let headerHeight = props.headerHeight ? props.headerHeight : '56px';
    let visibleRowsNumber = props.pageSize;
    let columns = props.columns;
    let rows = props.rows
    const [filteredRows, setFilteredRows] = useState(rows);
    // let rows = props.rows;
    let rowHeight = props.rowHeight;
    let minWidth = props.minWidth;
    if(!isNaN(rowHeight)) rowHeight = `${rowHeight}px`;
    rows.map((row, index1) => row.index = index1);
    let displayedColumns = columns.map(column => column);
    let displayedColumnsKeys = displayedColumns.map(column => column.field);
    const [visibleRows, setVisibleRows] = useState(rangeOfNumbers(0, Math.min(rows.length - 1, visibleRowsNumber - 1)));
    const [rowOrder, setRowOrder] = useState(Array.from(Array(rows.length).keys()));
    // let visibleRows = rangeOfNumbers(0, Math.min(rows.length - 1, visibleRowsNumber - 1));
    let rowsToDisplay = visibleRows.map(visibleRow => rows[visibleRow]);
    // console.log(`initialVisibleRows: ${visibleRows.toString()}`);

    // function sortTable(e) {
    //     let column = e.target;
    //     let sortOrder = "descending";
    //     if(column.dataset.sortOrder && column.dataset.sortOrder == 'descending') sortOrder = 'ascending';
    //     let columnIndex = column.dataset.columnIndex;
    //     let elementsToSort = [...tabelaRef.current.querySelectorAll(`.table-row-element[data-column-index="${columnIndex}"]`)];
    //     let sortedRowColumnElements = elementsToSort.sort((a,b) => {
    //         if(!isNaN(a.innerText) && !isNaN(b.innerText)) return sortOrder == 'descending' ? b.innerText-a.innerText : a.innerText-b.innerText;
    //         return sortOrder == 'descending' ? b.innerText.localeCompare(a.innerText) : a.innerText.localeCompare(b.innerText);
    //     });
    //     // let allSorted = sortedRowColumnElements.map(element => [...document.querySelectorAll(`.table-row-element[data-row-index="${element.dataset.rowIndex}"]`)]);
    //     setRowOrder(sortedRowColumnElements.map(element => element.dataset.rowIndex));
    //     // let flattedArray = allSorted.flat();
    //     // [...document.querySelectorAll('.table-header-element')].at(-1).after(...flattedArray);
    //     [...tabelaRef.current.querySelectorAll('.table-header-element')].forEach(element => element.dataset.sortOrder = null);
    //     column.dataset.sortOrder = sortOrder;
    //     console.log(`visible rows: ` + visibleRows.toString());
    //     // let newVisibleRows = visibleRows.map(index => newOrder[index]);
    //     // visibleRows = newVisibleRows;
    //     // visibleRows.forEach(rowNumber => [...tabelaRef.current.querySelectorAll(`.table-row-element[data-row-index="${rowNumber}"]`)].forEach(element => element.classList.remove('hidden')));
    //     // tabelaRef.current.querySelector('.pagination-data-displayer').innerText = `${!isNaN(visibleRows.at(0)) ? visibleRows.at(0) + 1 : 0}-${!isNaN(visibleRows.at(-1)) ? visibleRows.at(-1) + 1 : 0} of ${rows.length}`;
    // }

    function sortTable(e) {
        let column = e.target;
        let sortOrder = "descending";
        if(column.dataset.sortOrder && column.dataset.sortOrder == 'descending') sortOrder = 'ascending';
        let fieldName = column.dataset.fieldName;
        [...tabelaRef.current.querySelectorAll('.table-header-element')].forEach(element => element.dataset.sortOrder = null);
        column.dataset.sortOrder = sortOrder;
        setFilteredRows([...filteredRows].sort((a,b) => {
            // console.log(`${createElementFromHTML(a[fieldName])} vs ${b[fieldName].toString()}`);
            if(!isNaN(a[fieldName]) && !isNaN(b[fieldName])) return sortOrder == 'descending' ? b[fieldName]-a[fieldName] : a[fieldName]-b[fieldName];
            return sortOrder == 'descending' ? getNodeText(b[fieldName]).localeCompare(getNodeText(a[fieldName])) : getNodeText(a[fieldName]).localeCompare(getNodeText(b[fieldName]));
        }));
        // setVisibleRows(visibleRows);
    }

    function changePage(e) {
        let newVisibleRows = visibleRows;
        let direction = e.target.dataset.direction == 'left' ? -1 : 1;        
        if(direction == 1) {
            let min = visibleRows.at(-1) + 1;
            if (min > (filteredRows.length - 1)) return;
            let max = Math.min(visibleRows.at(-1) + (visibleRowsNumber), filteredRows.length - 1);
            // setVisibleRows(rangeOfNumbers(min, max));
            newVisibleRows = rangeOfNumbers(min, max);
        }
        else {
            let min = Math.max(0, visibleRows.at(0) - (visibleRowsNumber));
            let max = Math.min(min + (visibleRowsNumber - 1), rows.length - 1);
            // setVisibleRows(rangeOfNumbers(min, Math.min(min + (visibleRowsNumber - 1), rows.length - 1)));
            newVisibleRows = rangeOfNumbers(min, max);
        }
        setVisibleRows(newVisibleRows);
        // console.log(`visible rows: ${newVisibleRows}`);
        // [...tabelaRef.current.querySelectorAll(`.table-row-element:not(.hidden)`)].forEach(element => element.classList.add('hidden'));
        // visibleRows.forEach(rowNumber => [...tabelaRef.current.querySelectorAll(`.table-row-element[data-row-index="${rowNumber}"]`)].forEach(element => element.classList.remove('hidden')));
        // tabelaRef.current.querySelector('.pagination-data-displayer').innerText = `${!isNaN(visibleRows.at(0)) ? visibleRows.at(0) + 1 : 0}-${!isNaN(visibleRows.at(-1)) ? visibleRows.at(-1) + 1 : 0} of ${rows.length}`;
    }

    return (
        <div className='tabela' ref={tabelaRef} style={{minWidth : minWidth ? minWidth : 'auto'}}>
        <div className='tabela-data' style={{gridTemplateColumns: displayedColumns.map(column => column.flex ? (isNaN(column.flex) ? column.flex : `${column.flex}fr`) : "1fr").join(' '), height: `calc(${headerHeight} + ${(props.minHeight ? props.minHeight : rowHeight ? `calc(${rowHeight} * ${props.pageSize})` : null)})`}}>
            {displayedColumns.map((displayedColumn, displayedColumnIndex) => (
                <div key={displayedColumnIndex} style={{height: headerHeight}} className='table-cell table-header-element' data-column-index={`${displayedColumnIndex}`} data-field-name={displayedColumn.field} onClick={sortTable}>{displayedColumn.headerName}</div>
            ))}
            {/* {rowOrder.map(orderedIndex => rows[orderedIndex]).map((rowData, rowIndex) =>
                displayedColumnsKeys.map((displayedColumn, displayedColumnIndex) => (
                    // <div key={`${rowData.index}_${displayedColumnIndex}`} style={{height: rowHeight ? rowHeight : '50px'}} className={`table-cell table-row-element ${visibleRows.includes(rowIndex) ? '' : 'hidden'} ${rowData.specialStyling ? rowData.specialStyling : ''}`} data-column-index={`${displayedColumnIndex}`} data-row-index={`${rowData.index}`}><div className='cell-value-container'>{rowData[displayedColumn]}</div></div>
                    <div key={`${rowData.index}_${displayedColumnIndex}`} style={{height: rowHeight ? rowHeight : '50px'}} className={`table-cell table-row-element ${!visibleRows.includes(rowData.index) ? 'hidden' : ''} ${rowData.specialStyling ? rowData.specialStyling : ''}`} data-column-index={`${displayedColumnIndex}`} data-row-index={`${rowData.index}`}><div className='cell-value-container'>{rowData[displayedColumn]}</div></div>
                ))
            )} */}
            {visibleRows.map(visibleRowIndex => filteredRows[visibleRowIndex]).map((rowData, rowIndex) =>
                displayedColumnsKeys.map((displayedColumn, displayedColumnIndex) => (
                    // <div key={`${rowData.index}_${displayedColumnIndex}`} style={{height: rowHeight ? rowHeight : '50px'}} className={`table-cell table-row-element ${visibleRows.includes(rowIndex) ? '' : 'hidden'} ${rowData.specialStyling ? rowData.specialStyling : ''}`} data-column-index={`${displayedColumnIndex}`} data-row-index={`${rowData.index}`}><div className='cell-value-container'>{rowData[displayedColumn]}</div></div>
                    <div key={`${rowData.index}_${displayedColumnIndex}`} style={{height: rowHeight ? rowHeight : '50px'}} className={`table-cell table-row-element ${rowData.specialStyling ? rowData.specialStyling : ''}`} data-column-index={`${displayedColumnIndex}`} data-row-index={`${rowData.index}`}><div className='cell-value-container'>{rowData[displayedColumn]}</div></div>
                ))
            )}
            {/* <div style={{height:'inherit'}}></div> */}
        </div>
        <div className='tabela-footer'>
        <div className='pagination-data-displayer'>{!isNaN(visibleRows.at(0)) ? visibleRows.at(0) + 1 : 0}-{!isNaN(visibleRows.at(-1)) ? visibleRows.at(-1) + 1 : 0} of {rows.length}</div>
        <button className="pagination-arrow" data-direction="left" onClick={changePage}><svg width="24" height="24" viewBox="0 0 24 24" style={{transform: 'scale(-1,1)'}}><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg></button>
        <button className="pagination-arrow" data-direction="right" onClick={changePage}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg></button>
        </div>
        </div>
    )
}
