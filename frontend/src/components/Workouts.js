import React from 'react';
import './css/Menu.css';
import { useTable } from 'react-table';
import { useState, useEffect } from 'react';

function Workouts()
{
    const data = React.useMemo(
        () => [
          {
            col1: 'Minsk',
            col2: '27',
            col3: 'rain',
          },
          {
            col1: 'Vilnius',
            col2: '30',
            col3: 'rain',
          },
          {
            col1: 'London',
            col2: '23',
            col3: 'rain',
          },
        ],
        []
    )
   
    const columns = React.useMemo(
        () => [
          {
            Header: 'City',
            accessor: 'col1', // accessor is the "key" in the data
          },
          {
            Header: 'Temperature',
            accessor: 'col2',
          },
          {
            Header: 'Weather Forecast',
            accessor: 'col3', // accessor is the "key" in the data
          },
          {
            Header: 'Button',
            Cell: <button>10px</button>
          },
        ],
        []
    )
   
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data })

    return(
        <div class="grid-container">
            <div class="grid-child current">
                <h3>Workout list</h3>
                <table {...getTableProps()} style={{ }}>
         <thead>
         {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                   <th
                       {...column.getHeaderProps()}
                       style={{
                         borderBottom: 'solid 3px #7BD6FF',
                         color: 'black',
                       }}
                   >
                     {column.render('Header')}
                   </th>
               ))}
             </tr>
         ))}
         </thead>
         <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
               <tr {...row.getRowProps()}>
                 {row.cells.map(cell => {
                   return (
                       <td
                           {...cell.getCellProps()}
                           style={{
                             padding: '10px',
                           }}
                       >
                         {cell.render('Cell')}
                       </td>
                   )
                 })}
               </tr>
           )
         })}
         </tbody>
       </table>
            </div>

            <div class="grid-child new">
                <h3>Add new Workout</h3>
                <form>
                    <inputs>Workout Name </inputs>
                    <br></br>
                    <input type='text' name='weight'/>
                    <br></br>
                    <br></br>
                    <inputs>Date</inputs>
                    <br></br>
                    <input type='date' name='date'/>
                    <br></br>
                    <br></br>
                    <input type='submit'/>
                </form>
            </div>
        </div>
        
    );
};

export default Workouts;