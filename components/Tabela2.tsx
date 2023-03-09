// @ts-nocheck
"use client"
import React, { useState } from 'react'
import '../styles/tabela.css'

export default function Tabela2(props) {
    const tabelaRef = React.createRef();
    let headerHeight = props.headerHeight ? props.headerHeight : '56px';
    let visibleRowsNumber = props.pageSize;
    let columns = props.columns;
    let rows = props.rows;
    let rowHeight = props.rowHeight;
    if(!isNaN(rowHeight)) rowHeight = `${rowHeight}px`;
    rows.map((row, index1) => row.index = index1);
    let displayedColumns = columns.map(column => column);
    let displayedColumnsKeys = displayedColumns.map(column => column.field);
    const [visibleRows, setVisibleRows] = useState(Array.from(Array(visibleRowsNumber).keys()));
    const [rowOrder, setRowOrder] = useState(Array.from(Array(rows.length).keys()));
    const rangeOfNumbers = (a : int,b : int) => b-a >= 0 ? [...Array(b+1).keys()].slice(a) : []

    function sortTable(e) {
        let column = e.target;
        let sortOrder = "descending";
        if(column.dataset.sortOrder && column.dataset.sortOrder == 'descending') sortOrder = 'ascending';
        let columnIndex = column.dataset.columnIndex;
        let elementsToSort = [...tabelaRef.current.querySelectorAll(`.table-row-element[data-column-index="${columnIndex}"]`)];
        let sortedRowColumnElements = elementsToSort.sort((a,b) => {
            if(!isNaN(a.innerText) && !isNaN(b.innerText)) return sortOrder == 'descending' ? b.innerText-a.innerText : a.innerText-b.innerText;
            return sortOrder == 'descending' ? b.innerText.localeCompare(a.innerText) : a.innerText.localeCompare(b.innerText);
        });
        // let allSorted = sortedRowColumnElements.map(element => [...document.querySelectorAll(`.table-row-element[data-row-index="${element.dataset.rowIndex}"]`)]);
        setRowOrder(sortedRowColumnElements.map(element => element.dataset.rowIndex));
        // let flattedArray = allSorted.flat();
        // [...document.querySelectorAll('.table-header-element')].at(-1).after(...flattedArray);
        [...tabelaRef.current.querySelectorAll('.table-header-element')].forEach(element => element.dataset.sortOrder = null);
        column.dataset.sortOrder = sortOrder;
    }

    function changePage(e) {
        // let target = e.target.nodeName.toLowerCase() == 'svg' ? e.target : e.target.parentElement;
        let direction = e.target.dataset.direction == 'left' ? -1 : 1;
        if(direction == 1) {
            let max = Math.min(visibleRows.at(-1) + (visibleRowsNumber), rows.length - 1);
            let min = Math.min(visibleRows.at(-1) + 1, rows.length - 1);
            setVisibleRows(rangeOfNumbers(min, max));
        }
        else {
            let min = Math.max(0, visibleRows.at(0) - (visibleRowsNumber));
            setVisibleRows(rangeOfNumbers(min, Math.min(min + (visibleRowsNumber - 1), rows.length - 1)));
        }
    }

    return (
        // <table>
        //     <thead>
        //         <tr>
        //             {props.columns.map((columnData, index) => (
        //                 <th key={index}>{columnData.headerName}</th>
        //             ))}
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {rows.map((rowData, index) => (
        //             <tr key={index}>
        //                 {displayedColumns.map((displayedColumn, displayedColumnIndex) => (
        //                     <td key={displayedColumnIndex}>{rowData[displayedColumn]}</td>
        //                 ))}
        //             </tr>
        //         ))}
        //     </tbody>
        // </table> 
        <div className='tabela' ref={tabelaRef}>
        <div className='tabela-data' style={{gridTemplateColumns: displayedColumns.map(column => column.flex ? (isNaN(column.flex) ? column.flex : `${column.flex}fr`) : "1fr").join(' '), height: `calc(${headerHeight} + ${(props.minHeight ? props.minHeight : rowHeight ? `calc(${rowHeight} * ${props.pageSize})` : null)})`}}>
            {displayedColumns.map((displayedColumn, displayedColumnIndex) => (
                <div key={displayedColumnIndex} style={{height: headerHeight}} className='table-cell table-header-element' data-column-index={`${displayedColumnIndex}`} onClick={sortTable}>{displayedColumn.headerName}</div>
            ))}
            {rowOrder.map(orderedIndex => rows[orderedIndex]).map((rowData, rowIndex) =>
                displayedColumnsKeys.map((displayedColumn, displayedColumnIndex) => (
                    <div key={`${rowData.index}_${displayedColumnIndex}`} style={{height: rowHeight ? rowHeight : '50px'}} className={`table-cell table-row-element ${visibleRows.includes(rowIndex) ? '' : 'hidden'}`} data-column-index={`${displayedColumnIndex}`} data-row-index={`${rowData.index}`}>{rowData[displayedColumn]}</div>
                ))
            )}
        </div>
        <div className='tabela-footer'>
        <p>{visibleRows.at(0) + 1}-{visibleRows.at(-1) + 1} of {rows.length}</p>
        <button className="pagination-arrow" data-direction="left" onClick={changePage}><svg width="24" height="24" viewBox="0 0 24 24" style={{transform: 'scale(-1,1)'}}><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg></button>
        <button className="pagination-arrow" data-direction="right" onClick={changePage}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg></button>
        </div>
        </div>
    )
}
