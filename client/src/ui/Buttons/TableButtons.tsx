
type onClickType = {onClick: () => void};
function AddButtonCircle({onClick}: onClickType) {
  return (
    <button className='button-circle me-2 button-primary' onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    </button>
  )
}
function AddTableButtonCircle({onClick}: onClickType){
    return(
        <button className='button-circle me-2 button-violet' onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-table">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
            </svg>
        </button>
    )
}
function DeleteButtonCircle({onClick}: onClickType){
    return(
        <button className='button-circle me-2 button-purple' onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        </button>
    )
}

function ButtonTrayContainer({children}: {children: React.ReactNode}){
    return(
        <div className="pt-3 mb-1 text-sm">
            {children}
        </div>
    )
}

export {ButtonTrayContainer, AddButtonCircle, DeleteButtonCircle, AddTableButtonCircle}