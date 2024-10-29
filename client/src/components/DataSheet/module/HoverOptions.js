import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../css/App.css';
function HoverOptions({ is_hovered, row_index, addRow, is_checked, setIsChecked}) {
    const [check_value, setCheckValue] = useState(is_checked);
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
        setCheckValue((prev) => !prev);
        setIsChecked((prev) => !prev);
    };
    return (
        <AnimatePresence
        initial={false}
        mode='wait'
        onExitComplete={()=>null}>
        <motion.div 
            className="absolute top-3 left-0 z-10 p-2 rounded-lg" 
            style={{ transform: 'translate(-85%, -45%)', width: '100px' }}
            variants={hoverAnimation}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            exit="exit">
            <div className="flex flex-row items-center">
                <button 
                    type="button" onClick={addRowToTable}
                    className="button-circle-icon p-1 sm:m-0 mb-1" 
                    style={{ margin: '0.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <input type="checkbox" className="checkbox-primary" onChange={toggleIsChecked} checked={check_value}/>
            </div>
        </motion.div> 
        </AnimatePresence>
    );
}
export default HoverOptions;