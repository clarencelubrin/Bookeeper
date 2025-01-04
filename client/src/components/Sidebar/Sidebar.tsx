import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
<<<<<<< HEAD
import { LinkItemProps, LinkButtonProps, SidebarProps, SidebarBodyProps } from 'interfaces/Sidebar/SidebarInterface';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
export default function Sidebar({className, currentSheet, setCurrentSheet, style}: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    function handleToggle(){
        setIsOpen(!isOpen);
    }
    return (
        <>
            <SidebarBody isOpen={isOpen} className={className} currentSheet={currentSheet} setCurrentSheet={setCurrentSheet} style={style} />
            <SidebarToggle handleToggle={handleToggle}/>
        </>
    )
}
function SidebarToggle({handleToggle}: {handleToggle: () => void}){
    return(
        <div className='relative'>
            <div className="absolute top-1 left-1 transform">
                <button className="nav-button-circle gray bg-white w-8 h-8 opacity-25 hover:opacity-100 transition delay-100 duration-300 ease-in-out"
                    onClick={handleToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>                 
            </div>
        </div>
    )
}
function SidebarBody({isOpen, className, currentSheet, setCurrentSheet, style}: SidebarBodyProps) {
=======
import { LinkItemProps, LinkButtonProps, SidebarProps } from 'src/interfaces/Sidebar/SidebarInterface';

export default function Sidebar({className, currentSheet, setCurrentSheet}: SidebarProps) {
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    let files = useSelector((state: RootState) => state.file.content) as { filelist: string[], filename: string };
    const navigate: NavigateFunction = useNavigate();
    if (!files){
        return;
    }
    function handleOnClick(sheet: string, setCurrentSheet: (sheet: string) => void){
        setCurrentSheet(sheet);
    }
    const animation = {
        hidden: { 
            x: '-100%',
            opacity: 0,
            transition: {
                duration: 0.2,
                type: 'tween'
            }
        },
        visible: { 
            x: 0,
            opacity: 100,
            transition: {
                duration: 0.2,
                type: 'tween'
            }
        },
        exit: { 
            x: '-100%',
            opacity: 0,
            transition: {
                duration: 0.2,
                type: 'tween'
            }
        }
    };
    return(
    <AnimatePresence initial={false} mode='wait' onExitComplete={()=>null}>
    {isOpen &&
      <motion.div tabIndex={-1}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
        variants={animation}>
        <div className={`${className} h-full`} style={style}>
            <div className='grid grid-rows-12 h-full'>
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
                        <LinkItem onclick={() => {
                            navigate(`/${file}`);
                            window.location.reload();
                        }} key={file} link={file} currentFile={files['filename']}>
                            {file}
                        </LinkItem>
                    ))}
                    {(files.filelist && files['filelist'].length == 0) && 
                        <h2 className="font-bold text-center text-gray-400 mt-2">No recent files found.</h2>
                    }
                </div>
            </div>      
        </div>             
        </motion.div>
    }
    </AnimatePresence>
    )
}
<<<<<<< HEAD
function LinkItem({onclick, children, currentFile}: LinkItemProps){
=======

function LinkItem({link, children, currentFile}: LinkItemProps){
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    let selected_style = (currentFile === children) ? 'text-pink-500 hover:bg-pink-50' : 'text-gray-500 hover:bg-gray-100'

    return(
        <button onClick={onclick} className={`flex w-full ps-3 block rounded-md ${selected_style} my-1 px-2 py-1 transition duration-150 ease-out`}>
            <svg className="dropdown-icon feather feather-file-text" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <p className="truncate font-medium text-sm">
                {children}
            </p>
        </button>
    )
}

function LinkButton({onClick, currentSheet, children}: LinkButtonProps){
    let selected_style = (currentSheet === children) ? 'text-pink-500 hover:bg-pink-50' : 'text-gray-500 hover:bg-gray-100'
    return(
        <button onClick={onClick} className={`${selected_style} w-full block rounded-md text-left truncate font-medium text-sm m-1 px-2 py-1 ps-3`}>
            {children}
        </button>
    )
}