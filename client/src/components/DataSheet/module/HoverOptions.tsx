import React, { useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunctionContext } from './TableProvider';
import '../../../css/App.css';

interface HoverOptionsProps {
    absolute_position?: string;
    is_hovered: boolean;
    row_index: number;
    addRow: (row_index: number) => void;
    is_checked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

function HoverOptions({ absolute_position, is_hovered, row_index, addRow, is_checked, setIsChecked}: HoverOptionsProps) {
    const { setCheckedRows } = useContext(FunctionContext);
    absolute_position = absolute_position || 'top-4 left-4';
    const check_value = useRef(is_checked);
    const setCheckValue = (value: boolean) => {
        check_value.current = value;
    };
    useEffect(() => {
        setCheckValue(is_checked);
    }, [is_checked]);
    const isOpen = is_checked || is_hovered;
    const hoverAnimation = {
        hidden: { 
            x: '-80%',
            y: '-45%',
            opacity: 0, 
            scale: 0.8,
            transition: {
                duration: 0.2,
                type: 'tween'
            }
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.2,
                type: 'tween'
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: {
                duration: 0.2,
                type: 'tween'
            }
        }
    };
    // Add a new row to the table
    function addRowToTable(){
        addRow(row_index);
    }
    const toggleIsChecked = () => {
        setCheckValue(!check_value.current);
        setIsChecked((prev) => !prev);
        setCheckedRows((prev) => {
            let new_rows = [...prev];
            if (check_value.current && !prev.includes(row_index)) {
                new_rows = [...new Set([...prev, row_index].sort((a, b) => a - b))];
            } else {
                new_rows = [...new Set(prev.filter((index) => index !== row_index).sort((a, b) => a - b))];
            }
            return new_rows;
        });
    };
    return (
        <AnimatePresence
        initial={false}
        mode='wait'
        onExitComplete={()=>null}>
        <motion.div 
            className={`absolute ${absolute_position} z-10 rounded-lg scale-200`}
            style={{ width: '100px' }}
            variants={hoverAnimation}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            exit="exit">
            <div className="flex flex-row gap-1 items-center">
                <button 
                    type="button" onClick={addRowToTable}
                    className="button-icon sm:m-0 mb-1" 
                    style={{ margin: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <input type="checkbox" className="checkbox-primary" onChange={toggleIsChecked} checked={check_value.current}/>
            </div>
        </motion.div> 
        </AnimatePresence>
    );
}
export default HoverOptions;