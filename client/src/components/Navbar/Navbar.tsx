import React, { useState, useEffect, useRef, useContext  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { initData } from 'src/slices/dataSlice';
import Undo from 'scripts/Undo';
import Redo from 'scripts/Redo';

import { RootState } from 'src/Store';
import { saveDocument, downloadDocument, newDocument, renameDocument } from '../Route';

import Modal from '../Modals';
import WindowControlButtons from './module/WindowControlButtons';

import { FileSelectorInterface } from 'interfaces/Slices/FileSliceInterface';
import { NavbarProps, DropdownMenuProps, DropdownMenuItemProps } from 'interfaces/Navbar/NavbarInterface'; 
import { ThemeContext } from 'theme/ThemeProvider';

import { autoLedger } from 'src/scripts/AutoLedger';
import { ledger_type } from 'src/interfaces/Scripts/AutoLedgeTypes';
import 'css/App.css';


=======
import Undo from 'scripts/Undo';
import Redo from 'scripts/Redo';
import { RootState } from 'src/Store';
import { Route } from '../Route';
import Modal from '../Modals';
import WindowControlButtons from './module/WindowControlButtons';
import { FileSliceInterface } from 'interfaces/Slices/FileSliceInterface';
import { NavbarProps, DropdownMenuProps, DropdownMenuItemProps } from 'interfaces/Navbar/NavbarInterface'; 
import { ThemeContext } from 'theme/ThemeProvider';
import 'css/App.css';


>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3

function Navbar({ show_navlink = true, show_titletexbox = true, show_dropdown = true }: NavbarProps){   
    const [is_dropdown_open, setIsDropdownOpen] = useState(false);
    const { theme } = useContext(ThemeContext);
    const menuRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current === null) {
                return;
            }
            else if (event.target && !menuRef.current.contains(event.target as Node) && !modalRef.current?.contains(event.target as Node)){ 
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
    }, [menuRef]);

    useEffect(() => {
        const handleResize = () => {
            if (show_navlink === false){
                return
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <nav className="navbar mx-auto h-10 flex items-center justify-between">
            <div className="ms-2 flex items-center">
                {show_dropdown &&
                <div className="relative" ref={menuRef}>
                    <DropdownMenuButton onClick={()=>{setIsDropdownOpen(!is_dropdown_open)}} />
                    <DropdownMenu modalRef={modalRef} is_open={is_dropdown_open}/>
                </div>}
                <div className='ms-3 space-x-8'>
<<<<<<< HEAD
                    <Link to="/" className={`navbar-item text-${theme.styles.primaryColor}-500 inline-flex items-center text-wrap sm:max-w-full text-center text-lg font-bold`}>
                        {theme.text.TITLE}
                    </Link>
=======
                    <a href="/" className={`navbar-item text-${theme.styles.primaryColor}-500 inline-flex items-center text-wrap sm:max-w-full text-center text-lg font-bold`}>
                        {theme.text.TITLE}
                    </a>
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
                </div>
            </div>                
            <div className="flex items-center gap-3 me-1">
                {show_titletexbox &&
                <TitleTextbox />
                }
                <WindowControlButtons />
            </div>
        </nav>
    )
}

function TitleTextbox(){
    // const files = useSelector((state: RootState) => state.file.content) as unknown as FileSelectorInterface;
    let location = useLocation();
    let current_filename = location.pathname.replace('/', '').replace('.xlsx', '');
    const [value, setValue] = useState(current_filename);

    const navigate = useNavigate();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);

    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(value);
        renameDocument(`${value}.xlsx`, `${current_filename}.xlsx`, navigate);
    }
    useEffect(() => {
        setValue(current_filename);
    }, [current_filename]);
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange}  value={value} placeholder="Title" 
                className="navbar-item input-primary sm:w-auto w-32 focus:translate-y-0 focus:scale-100 px-2
                text-right text-pink-500 font-medium">
            </input>
        </form>
    )
}

<<<<<<< HEAD
=======

>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3


function DropdownMenu({is_open, modalRef}: DropdownMenuProps){
    const [show_recent_files, setShowRecentFiles] = useState(false);
    const [show_upload_modal, setShowUploadModal] = useState(false);
    const [show_delete_modal, setShowDeleteModal] = useState(false);
<<<<<<< HEAD
    // let files: FileSliceInterface['content'] = useSelector((state: RootState) => state.file.content);
=======
    let files: FileSliceInterface['content'] = useSelector((state: RootState) => state.file.content);
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    
    let files = useSelector((state: RootState) => state.file.content) as unknown as FileSelectorInterface;
    let location = useLocation();
    let current_filename = location.pathname.replace('/', '');

    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.data)['present']['content'];
    const widths = useSelector((state: RootState) => state.widths)['content'];
    const past_data = useSelector((state: RootState) => state.data)['past'];
    const future_data = useSelector((state: RootState) => state.data)['future'];
    
    const [computedLedger, setComputedLedger] = useState<ledger_type | undefined>(undefined);
    const navigate = useNavigate();
    const bounceAnimation = {
        hidden: { 
            opacity: 0, 
            x: -50,
            scale: 0.8,
            transition: {
                duration: 0.1,
                type: 'tween'
            }
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            x: -15,
            transition: {
                duration: 0.1,
                type: 'tween'
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8,
            x: -50,
            transition: {
                duration: 0.1,
                type: 'tween'
            }
        }
    };
    const recentFilesAnimation = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            transition: {
                duration: 0.1,
                type: 'tween'
            }
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.1,
                type: 'tween'
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: {
                duration: 0.1,
                type: 'tween'
            }
        }
    };

    useEffect(() => {
        if (data) {
            let modified_data = {
                ...(typeof data['spreadsheet'] === 'object' ? data['spreadsheet'] : {}),
                'General Ledger': computedLedger
            }
            dispatch(initData({'spreadsheet': modified_data}));
        }
    }, [computedLedger])
    return (
        <AnimatePresence
        initial={false}
        mode='wait'
        onExitComplete={()=>null}>
        {is_open &&
        <motion.div className="navbar-item absolute top-8 left-4 z-5 w-48 origin-top-right bg-white rounded-lg
        shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" tabIndex={-1}
            variants={bounceAnimation}
            initial="hidden"
            animate={is_open ? "visible" : "hidden"}
            exit="exit"
            >
            <DropdownMenuItem 
                onClick={() => newDocument(navigate)}
                name="Create new file"
                icon={<svg className="dropdown-icon feather feather-file-plus" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>}
            />
            <DropdownMenuItem 
                onClick={()=>saveDocument(current_filename, data, widths, navigate)}
                name="Save file"
                icon={<svg className="dropdown-icon feather feather-save" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>}
            />
            <hr/>
            <DropdownMenuItem
                name="Undo"
                icon={<svg className="dropdown-icon feather feather-rotate-ccw" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>}
                onClick={()=>{Undo({past_data, dispatch})}}
            />
            <DropdownMenuItem
                name="Redo"
                icon={<svg className="dropdown-icon feather feather-rotate-cw" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>}
                onClick={()=>{Redo({future_data, dispatch})}}
            />
            <hr/>
            <DropdownMenuItem 
                name="Open recent files"
                icon={<svg className="dropdown-icon feather feather-clock" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                onClick={()=>{setShowRecentFiles(!show_recent_files)}}
            />
            <AnimatePresence initial={false} mode='wait' onExitComplete={()=>null}>
                {show_recent_files &&
                <motion.div tabIndex={-1}
                    variants={recentFilesAnimation}
                    initial="hidden"
                    animate={is_open ? "visible" : "hidden"}
                    exit="exit"
                    className=''>
                    {files && Array.isArray(files.filelist) && files.filelist.map((file: string) => (
                        <Link to={`/${file}`} onClick={()=>{}} 
                            className="flex flex-row relative block truncate px-3 py-1 my-1
                            text-sm text-gray-700
                            hover:bg-gray-100">
                            {file}
                        </Link>  
                    ))}
                    <hr/>
                </motion.div>}
            </AnimatePresence>
            <DropdownMenuItem
                name="Export to .xlsx"
                onClick={()=>downloadDocument(current_filename)}
                icon={<svg className="dropdown-icon feather feather-download" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>}
            />                
            <DropdownMenuItem
                name="Import .xlsx"
                icon={<svg className="dropdown-icon feather feather-upload" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>}
                onClick={()=>{setShowUploadModal(!show_upload_modal)}}
            />
            <Modal 
                modalType={'upload'} 
                showModal={show_upload_modal} 
                onClickBackdrop={()=>{setShowUploadModal(!show_upload_modal)}}
                modalRef={modalRef}
            />
            <hr/>
            <DropdownMenuItem
                name="Auto-fill Ledger"
                icon={    
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon feather feather-edit-3">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                }
                onClick={()=>{
                    const computed_ledger = autoLedger(data?.['spreadsheet']['Chart of Accounts'], data?.['spreadsheet']['General Journal'])
                    console.log(computed_ledger)
                    if (computed_ledger !== undefined){
                        setComputedLedger(computed_ledger)
                        window.ipcRenderer.send('show-alert', {'title': 'Auto-fill Ledger', 'message': 'Ledger has been auto-filled!'});
                        console.log('Updated!')
                    }
                }}
            />
            <hr/>
            <DropdownMenuItem
                name="Delete permanently"
                icon={<svg className="dropdown-icon feather feather-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                onClick={()=>{setShowDeleteModal(!show_delete_modal)}}
            />
            <Modal 
                modalType={'delete'} 
                showModal={show_delete_modal} 
                onClickBackdrop={()=>{setShowDeleteModal(!show_delete_modal)}}
                modalRef={modalRef}
            />
        </motion.div>}
        </AnimatePresence>
    )
}



function DropdownMenuItem({name, icon, onClick = ()=>{}}: DropdownMenuItemProps){
    const handleOnClick = () => {
        onClick();
    }
    return (
        <div className='navbar-item rounded-lg px-2 py-1 m-1 focus:ring focus:ring-pink-300 hover:bg-pink-100 hover:border-pink-500'>
            <button className="flex flex-row relative block truncate text-sm text-gray-700 w-full disabled:opacity-50"
                onClick={handleOnClick}>
                {icon}
                {name}
            </button>
        </div>
    )
}
function DropdownMenuButton({onClick = ()=>{}}){
    const handleOnClick = () => {
        onClick();
    }
    return (
        <button type="button" className="navbar-item ms-2 me-1 mt-2" onClick={handleOnClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>      
    )
}
export default Navbar
