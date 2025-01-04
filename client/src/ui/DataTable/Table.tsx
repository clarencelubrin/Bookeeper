type childrenType = {children: React.ReactNode};
type headerRowType = {children: React.ReactNode, className?: string};
type rowType = {children: React.ReactNode, className?: string, onMouseEnter?: () => void, onMouseLeave?: () => void};
type headerCellType = {style: React.CSSProperties, children: React.ReactNode};
type cellType = {className?: string, children: React.ReactNode};

function Table({children}: childrenType) {
  return (
    <table className="data-table bg-white table resizable">
        {children}
    </table>
  )
}
function TableHead({children}: childrenType) {
  return (
    <thead className='table-header'>
        {children}
    </thead>
  )
}
function TableBody({children}: childrenType) {
    return (
        <tbody>
            {children}
        </tbody>
    )
}
function HeaderRow({children, className=''}: headerRowType) {
    return (
        <tr className={`table-header-row ${className}`}>
            {children}
        </tr>
    )
}
function Row({className='', onMouseEnter, onMouseLeave, children}: rowType) {
    return (
        <tr className={`table-row ${className}`}
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}>
            {children}
        </tr>
    )
}
function HeaderCell({style, children}: headerCellType) {
    return (
        <th className='px-3 py-2 text-sm font-semibold' style={style}>
            {children}
        </th>
    )
}
function Cell({className='', children}: cellType) {
    return (
        <td className={`table-row-cell py-1 px-2 ${className}`}>
            {children}
        </td>
    )
}
export { Table, TableHead, TableBody, HeaderRow, Row, HeaderCell, Cell }