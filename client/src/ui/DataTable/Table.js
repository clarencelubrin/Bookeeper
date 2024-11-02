import React from 'react'

function Table({children}) {
  return (
    <table className="data-table table resizable">
        {children}
    </table>
  )
}
function TableHead({children}) {
  return (
    <thead className='table-header'>
        {children}
    </thead>
  )
}
function TableBody({children}) {
    return (
        <tbody>
            {children}
        </tbody>
    )
}
function HeaderRow({children}) {
    return (
        <tr className='table-header-row'>
            {children}
        </tr>
    )
}
function Row({className, onMouseEnter, onMouseLeave, children}) {
    return (
        <tr className={`table-row ${className}`}
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}>
            {children}
        </tr>
    )
}
function HeaderCell({style, children}) {
    return (
        <th className='px-3 py-2 text-sm font-semibold' style={style}>
            {children}
        </th>
    )
}
function Cell({className, children}) {
    return (
        <td className={`table-row-cell py-1 px-2 ${className}`}>
            {children}
        </td>
    )
}
export { Table, TableHead, TableBody, HeaderRow, Row, HeaderCell, Cell }