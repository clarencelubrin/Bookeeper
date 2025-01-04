import { useState } from 'react';
<<<<<<< HEAD
import { deleteDocument, uploadDocument } from 'components/Route';
=======
import { deleteDocument } from 'components/Route';
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProps, BackdropProps } from 'interfaces/Modals/ModalsInterfaces';
import 'css/App.css';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const modalRoot = document.body;

<<<<<<< HEAD
function Modal({showModal, modalType, onClickBackdrop, modalRef}: ModalProps) {
=======
function Modal({showModal, modalType, onClickBackdrop}: ModalProps) {
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
  return (
    <AnimatePresence initial={false} mode='wait' onExitComplete={()=>null}>
    {showModal &&
      <motion.div tabIndex={-1}
        initial="hidden"
        animate={showModal ? "visible" : "hidden"}
        exit="exit"
        className='bg-gray-50'>
        {createPortal(
          <Backdrop onClickBackdrop={onClickBackdrop} modalRef={modalRef}>
            {(modalType === "upload") && <UploadContentModal />}
            {(modalType === "delete") && <DeleteContentModal handleOnClickCancel={onClickBackdrop} />}
          </Backdrop>          
          ,
          modalRoot
        )}
      </motion.div>      
    }      
    </AnimatePresence>
  )
}

<<<<<<< HEAD
function Backdrop ({children, onClickBackdrop, modalRef}: BackdropProps){
=======


function Backdrop ({children, onClickBackdrop}: BackdropProps){
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
  return (
    <div className="fixed z-50 inset-0 backdrop-blur-md bg-gray/50 w-screen h-screen" ref={modalRef}>
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" onClick={onClickBackdrop}>
        <div className="bg-white shadow-xl px-4 pb-4 pt-5 rounded-lg sm:p-6 sm:pb-4" onClick={(e) => e.stopPropagation()}>
          <div className="sm:flex sm:items-start">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadContentModal() {
    const [file, setFile] = useState<File | null>(null);
    const navigator = useNavigate();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        uploadDocument(file, navigator);

        // Make the request to upload the file
        // const response = await fetch('/upload', {
        //     method: 'POST',
        //     body: formData,
        // })
        // const result = await response.json();
        // if (result.success) {
        //     document.body.style.cursor = 'default';
        //     alert('Data saved successfully!');
        //     window.location.href = `/${result.filename}`;
        // } else {
        //     document.body.style.cursor = 'default';
        //     alert(result.message);
        // }
    };

    return (
    <div className="w-full text-center sm:mt-0 sm:text-left">
        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Upload .xlsx file</h3>
        <button type="button">
            <i className="fa-regular fa-circle-xmark absolute p-5 inset-y-0 right-0"></i>
        </button>
        <form onSubmit={handleSubmit} className="w-full flex items-center space-x-6 mb-3">
            <div className="grid grid-cols-4 w-full">
                <input type="file" id="file" name="file" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 col-span-3"/>
                <button type="submit" className="flex rounded-full items-center text-sm text-blue-500 py-2 px-4 col-span-1 justify-self-center button-blue">
                    Upload
                    <svg style={{ marginTop: "2px", marginLeft: "6px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </button>
            </div>
        </form>
    </div>
    );
}

function DeleteContentModal({handleOnClickCancel}: {handleOnClickCancel: () => void}){
<<<<<<< HEAD
  const navigate = useNavigate();
  const location = useLocation();
=======
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
  const handleOnClick = async () => {
    const filename: string | undefined = location.pathname.split('/').pop();
     // Make the request to upload the file
    deleteDocument(filename || '', navigate);
  }
  return(
  <div className="w-full text-center sm:mt-0 sm:text-left">
    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete permanently</h3>
    <p className="text-sm">Do you want to delete this file permanently? This action is irreversible.</p>
    <div className="mt-4 flex justify-between">
      <button
          className="text-sm
          py-2 px-4 min-w-24
          rounded-full border-0
          text-sm font-semibold
          bg-gray-100 text-gray-700 transition duration-150 ease-in-out
          hover:bg-gray-300 col-span-1 justify-self-center 
          "
          onClick={handleOnClickCancel}>Cancel</button>
      <button onClick={handleOnClick} className="text-sm 
          py-2 px-4
          rounded-full border-0
          text-sm font-semibold
          bg-red-600 text-white transition duration-150 ease-in-out
          hover:bg-red-700 col-span-1 justify-self-center 
          ">Delete permanently
      </button>
    </div>
  </div>
  )
}

export default Modal