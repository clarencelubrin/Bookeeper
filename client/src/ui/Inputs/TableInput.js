import React from 'react';
function TableInput({input_type, inputRef, value, placeholder, inputClass, style, handleChange, handleKeyDown}) {
    return (
        <>
            {input_type === 'input' && 
            <input
                type="text"
                ref={inputRef}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`input-primary ${inputClass} ${style}`}
            />}
            {input_type === 'textarea' &&
            <textarea
                ref={inputRef}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className={`input-primary ${inputClass} ${style}`}
            />}        
        </>
    );
}
export default TableInput;