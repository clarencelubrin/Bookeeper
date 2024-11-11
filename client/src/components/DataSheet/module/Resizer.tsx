import React, { useRef } from 'react';
import '../../../css/App.css';

function Resizer({setSheetWidths, thIndex}) {
    const currentThRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);
    const onResizeClick = (e) => {
        const currentTh = e.target.parentElement;
        currentThRef.current = currentTh;
        startXRef.current = e.clientX;
        startWidthRef.current = currentTh.offsetWidth;

        // Prevent text selection during resizing
        document.body.style.userSelect = 'none';

        // Add event listeners for move and stop
        document.addEventListener('mousemove', resizeColumn);
        document.addEventListener('mouseup', stopResize);
    };

    // Mouse move
    const resizeColumn = (e) => {
        const width = startWidthRef.current + (e.clientX - startXRef.current);
        // Set a minimum column width
        if (width > 50) {
            setSheetWidths(prevState => {
                const newState = [...prevState];
                newState[thIndex] = width;
                return newState;
            });
        }
    };

    // Mouse up
    const stopResize = () => {
        // Re-enable text selection after resizing
        document.body.style.userSelect = '';
        
        // Clean up event listeners
        document.removeEventListener('mousemove', resizeColumn);
        document.removeEventListener('mouseup', stopResize);
    };

    return (
        <div className="resizer" onMouseDown={onResizeClick} />
    );
}
export default Resizer;
