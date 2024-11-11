import { MinimizeButton, WindowButton, ExitButton } from '../../../ui/Buttons/WindowControlButtons';
const WindowControlButtons = () => {
    const handleMinimize = () => {
        window.ipcRenderer.minimizeWindow();
    };

    const handleMaximize = () => {
        window.ipcRenderer.maximizeWindow();
    };

    const handleClose = () => {
        window.ipcRenderer.closeWindow();
    };

    return (
        <div className='flex flex-row navbar-item'>
            <MinimizeButton onClick={handleMinimize} />
            <WindowButton onClick={handleMaximize} />
            <ExitButton onClick={handleClose} />
        </div>
    );
};


export default WindowControlButtons;
