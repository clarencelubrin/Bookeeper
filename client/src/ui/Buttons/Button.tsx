import React from 'react'

function Button({buttonType, onClick, children}) {
  return (
    <button className={`button button-${buttonType}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default Button