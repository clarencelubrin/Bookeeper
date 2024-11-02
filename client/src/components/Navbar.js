import { useState, useEffect, createContext  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import Route from './Route';
import Modal from './Modals';
import '../css/App.css';

function Navbar({show_navlink, show_titletexbox, show_dropdown}){
    if(show_navlink === undefined) show_navlink = true;
    if(show_titletexbox === undefined) show_titletexbox = true;
    if(show_dropdown === undefined) show_dropdown = true;
    
    const [is_dropdown_open, setIsDropdownOpen] = useState(false);
    const [is_chart_open, setIsChartOpen] = useState(false);
    return (
        <nav className="backdrop-blur-lg bg-white/50 shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 h-12">
                    <a href="/" className="text-pink-500 inline-flex items-center text-wrap sm:max-w-full text-center text-lg font-bold">Bookeeper</a>
                    {show_navlink &&
                    <>
                        <NavLink title="General Journal" href="#General-Journal"/>
                        <NavLink title="General Ledger" href="#General-Ledger"/>
                        <NavLink title="Chart of Accounts" onClick={()=>{setIsChartOpen(!is_chart_open)}}/>
                        <Modal modalType={'chart-of-accounts'} showModal={is_chart_open} onClickBackdrop={()=>{setIsChartOpen(!is_chart_open)}}/>
                    </>}

                    <div className="absolute inset-y-0 right-0 mt-2 items-center">
                        <div className="flex flex-row">
                            {show_titletexbox &&
                            <TitleTextbox />}
                            {show_dropdown &&
                            <div className="relative text-left">
                                <DropdownMenuButton onClick={()=>{setIsDropdownOpen(!is_dropdown_open)}} />
                                <DropdownMenu is_open={is_dropdown_open}/>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function NavLink({title, href, onClick}){
    return(
        <a href={href} onClick={onClick} className="text-gray-900 inline-flex items-center pt-1 text-wrap sm:max-w-full text-center text-sm font-medium">{title}</a> 
    )
}

function TitleTextbox(){
    const [value, setValue] = useState(window.location.pathname.split('/').pop().replace('.xlsx',''));
    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (
        <Route routeType="rename" parameters={value+'.xlsx'}>
            <input type="text" onChange={handleChange} value={value} placeholder="Title" 
                className="input-primary sm:w-auto me-3 px-2 my-1 w-32 focus:translate-y-0 focus:scale-100
                text-right text-pink-500 font-medium">
            </input>
        </Route>

    )
}
function DropdownMenu({is_open}){
    const [show_recent_files, setShowRecentFiles] = useState(false);
    const [show_upload_modal, setShowUploadModal] = useState(false);
    const [show_delete_modal, setShowDeleteModal] = useState(false);
    let files = useSelector((state) => state.file)['content'];
    const bounceAnimation = {
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
    return (
        <AnimatePresence
        initial={false}
        mode='wait'
        onExitComplete={()=>null}>
        {is_open &&
        <motion.div className="absolute top-10 right-2 z-20 w-48 origin-top-right bg-white rounded-lg
        shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" tabIndex={-1}
            variants={bounceAnimation}
            initial="hidden"
            animate={is_open ? "visible" : "hidden"}
            exit="exit">
            <Route routeType="new_document">
                <DropdownMenuItem 
                    name="Create new file"
                    icon={<svg className="dropdown-icon feather feather-file-plus" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>}
                />
            </Route>
            <Route routeType="save" parameters={window.location.pathname.split('/').pop()}>
                <DropdownMenuItem 
                    name="Save file"
                    icon={<svg className="dropdown-icon feather feather-save" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>}
                />
            </Route>
            <DropdownMenuItem 
                name="Open recent files"
                icon={<svg className="dropdown-icon feather feather-clock" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                onClick={()=>{setShowRecentFiles(!show_recent_files)}}
            />
            <AnimatePresence initial={false} mode='wait' onExitComplete={()=>null}>
                {show_recent_files &&
                <motion.div tabIndex={-1}
                    variants={bounceAnimation}
                    initial="hidden"
                    animate={is_open ? "visible" : "hidden"}
                    exit="exit"
                    className='bg-gray-50'>
                    {files['filelist'].map((file) => (
                        <a href={`/${file}`} onClick={()=>{}} className="flex flex-row relative block truncate px-3 py-1 my-1
                        text-sm text-gray-700
                        hover:bg-gray-100">{file}</a>  
                    ))}
                    <hr/>
                </motion.div>}
            </AnimatePresence>
            <Route routeType="download">
                <DropdownMenuItem
                    name="Export to .xlsx"
                    icon={<svg className="dropdown-icon feather feather-download" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>}
                />                
            </Route>
            <DropdownMenuItem
                name="Import .xlsx"
                icon={<svg className="dropdown-icon feather feather-upload" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>}
                onClick={()=>{setShowUploadModal(!show_upload_modal)}}
            />
            <Modal modalType={'upload'} showModal={show_upload_modal} onClickBackdrop={()=>{setShowUploadModal(!show_upload_modal)}}/>
            <hr/>
            <DropdownMenuItem
                name="Delete permanently"
                icon={<svg className="dropdown-icon feather feather-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                onClick={()=>{setShowDeleteModal(!show_delete_modal)}}
            />
            <Modal modalType={'delete'} showModal={show_delete_modal} onClickBackdrop={()=>{setShowDeleteModal(!show_delete_modal)}}/>
        </motion.div>}
        </AnimatePresence>
    )
}
function DropdownMenuItem({name, icon, onClick}){
    const handleOnClick = () => {
        onClick();
    }
    return (
        <div className='rounded-lg px-2 py-1 m-1 focus:ring focus:ring-pink-300 hover:bg-pink-100 hover:border-pink-500'>
            <button className="flex flex-row relative block truncate text-sm text-gray-700 w-full" 
                onClick={handleOnClick}>
                {icon}
                {name}
            </button>
        </div>
    )
}
function DropdownMenuButton({onClick}){
    const handleOnClick = () => {
        onClick();
    }
    return (
        <button type="button" className="me-4 ms-1 mt-2" onClick={handleOnClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>      
    )
}
export default Navbar
