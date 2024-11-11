import { useSelector } from 'react-redux';
import { RootState } from '../../Store';

interface SidebarProps {
    className: string;
    currentSheet: string;
    setCurrentSheet: (sheet: string) => void;
}
export default function Sidebar({className, currentSheet, setCurrentSheet}: SidebarProps) {
    let files = useSelector((state: RootState) => state.file.content) as { filelist: string[], filename: string };
    if (!files){
        return;
    }
    function handleOnClick(sheet: string, setCurrentSheet: (sheet: string) => void){
        setCurrentSheet(sheet);
    }
    return (
        <div className={`${className}`}>
            <div className='grid grid-rows-12 h-screen'>
                <div className='row-span-4 pt-3 px-4'>
                    <h1 className='font-semibold text-sm text-gray-400'>Your Sheets</h1>
                    <LinkButton 
                        currentSheet={currentSheet}
                        onClick={() => handleOnClick("General Journal", setCurrentSheet)} 
                        children="General Journal" />
                    <LinkButton  
                        currentSheet={currentSheet}
                        onClick={() => handleOnClick("General Ledger", setCurrentSheet)} 
                        children="General Ledger" />
                    <LinkButton  
                        currentSheet={currentSheet}
                        onClick={() => handleOnClick("Chart of Accounts", setCurrentSheet)} 
                        children="Chart of Accounts" />                
                </div>
                <div className='row-span-7 overflow-y-auto px-4'>
                    <h1 className='font-semibold text-sm text-gray-400'>Files</h1>
                    {files.filelist && files.filelist.map((file: string) => (
                        <LinkItem key={file} link={file} currentFile={files['filename']}>
                            {file}
                        </LinkItem>
                    ))}
                    {(files.filelist && files['filelist'].length == 0) && 
                        <h2 className="font-bold text-center text-gray-400 mt-2">No recent files found.</h2>
                    }
                </div>
            </div>            
        </div>

    )
}
interface LinkItemProps {
    link: string;
    children: string;
    currentFile: string;
}
function LinkItem({link, children, currentFile}: LinkItemProps){
    let selected_style = (currentFile === children) ? 'text-pink-500 hover:bg-pink-50' : 'text-gray-500 hover:bg-gray-100'
    const handleOnClick = () => {
        window.location.href = `/${link}`;
    }
    return(
        <button onClick={handleOnClick} className={`flex w-full ps-3 block rounded-md ${selected_style} my-1 px-2 py-1 transition duration-150 ease-out`}>
            <svg className="dropdown-icon feather feather-file-text" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <a className="truncate font-medium text-sm">
                {children}
            </a>
        </button>
    )
}
interface LinkButtonProps {
    onClick: () => void;
    currentSheet: string;
    children: string;
}
function LinkButton({onClick, currentSheet, children}: LinkButtonProps){
    let selected_style = (currentSheet === children) ? 'text-pink-500 hover:bg-pink-50' : 'text-gray-500 hover:bg-gray-100'
    return(
        <button onClick={onClick} className={`${selected_style} w-full block rounded-md text-left truncate font-medium text-sm m-1 px-2 py-1 ps-3`}>
            {children}
        </button>
    )
}