import React, { useRef } from 'react';
import '../../../css/App.css';

type ResizerProps = {
    setSheetWidths: React.Dispatch<React.SetStateAction<number[]>>;
    thIndex: number;
};
interface ResizeClickEvent extends React.MouseEvent<HTMLDivElement> {
    target: HTMLDivElement & EventTarget;
}

function Resizer({setSheetWidths, thIndex}: ResizerProps) {
    const currentThRef = useRef<HTMLDivElement | null>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    const onResizeClick = (e: ResizeClickEvent) => {
        const currentTh = e.target.parentElement as HTMLDivElement;
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
    const resizeColumn = (e: MouseEvent) => {
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
