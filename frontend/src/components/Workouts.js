import React from 'react';
import './css/Menu.css';
import { useTable } from 'react-table';
import { useState, useEffect } from 'react';

function Workouts()
{
    const data = React.useMemo(
        () => [
          {
            col1: 'RUNNING',
         
            
          },
          {
            col1: 'WEIGHT LIFTING ',
          
          },
          {
            col1: 'WALKING',
            
          
          },
        ],
        []
    )
   
    const columns = React.useMemo(
        () => [
          {
            Header: 'Name',
            accessor: 'col1', // accessor is the "key" in the data
          },
          {
            Header: 'Edit',
            Cell: <button>Edit</button>
          },
          {
            Header: 'Delete',
            Cell: <button>Delete</button>

          },

          {
            Header: 'Add ',
            Cell: <button>Add Alarm</button>
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
                <table {...getTableProps()} >
         <thead>
         {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                   <th
                       {...column.getHeaderProps()}
                       style={{
                         borderBottom: 'solid 5px #7BD6FF',
                         color: '#ffbdad',
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
                             border: '0px',
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