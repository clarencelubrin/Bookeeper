import React from 'react'

function TableSubtitle({children}) {
    const childrenCount = React.Children.count(children);
    return (
        <div className={`subtitle-group-ledger mb-3 grid sm:grid-cols-${childrenCount+1} grid-cols-${childrenCount} font-semibold bg-transparent`}>
            {children}
        </div>
    )
}

export default TableSubtitle;