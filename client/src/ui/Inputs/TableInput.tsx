import React, { MutableRefObject } from 'react';
interface TableInputProps {
    input_type: string;
    key: number;
    inputRef?: MutableRefObject<any>;
    value: any;
    placeholder?: string;
    inputClass: string;
    style?: string;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleKeyDown?: (e: React.KeyboardEvent) => void;
}

function TableInput({input_type, inputRef, value, placeholder, inputClass, style, handleChange, handleKeyDown}: TableInputProps) {
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