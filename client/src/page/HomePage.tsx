import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFiles } from '../slices/fileSlice';
import Loading from '../components/Loading/Loading';
import { RootState } from '../Store';
import { newDocument } from '../components/Route';
import axios from 'axios';
function HomePage(){
    const dispatch = useDispatch();
    useEffect(() => {
      axios.get('api/homepage')
          .then((response) => {
              // Axios parses JSON automatically, so you don't need `response.json()`
              console.log("IM HEREE");
              console.log(response.data);
  
              const fetchedData = response.data;
              const files = {
                  'filename': fetchedData['filename'],
                  'filelist': fetchedData['filelist']
              };
  
              // Dispatch action to update Redux store
              dispatch(setFiles(files));
  
              // Update browser history
              window.history.pushState({}, '', `/`);
          })
          .catch((error) => {
              console.error('There was a problem with the fetch operation:', error);
          });
    }, []);
  
    let files = useSelector((state: RootState) => state.file.content) as { filelist: string[], filename: string };
    if (Object.keys(files).length === 0) {
      console.log("Loading...");
      return <Loading />;
    }
    return (
      <div className="min-h-screen">
          <div className="bg-gray-50 p-3">
              <div className="h-12"></div>  
              <div className="container mx-auto p-5">
                  <h1 className="text-2xl font-semibold text-gray-700">Create new file</h1>
                  <div className="pt-4">
                    <button title="Create New" onClick={()=>{newDocument()}}>
                        <div className="bg-white border-2 border-gray-200 grid place-content-center
                        hover:bg-pink-50 transition duration-100 ease-in-out" style={{height: "15rem", width: "10rem"}}>
                          <svg className="feather feather-file-plus" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                        </div>
                    </button>
                  </div>
              </div>
          </div>
          <div className="container mx-auto p-5">
              <h1 className="text-2xl font-semibold text-gray-700">Open recent files</h1>
              <div className="pt-4">
                  {files && files['filelist'].map((file: string) => (
                    console.log(file, "this is the file from homepage"),
                      <LinkFile key={file} file={file} />
                  ))}
                  {(files['filelist'].length == 0) && <div className="text-center text-gray-500 mt-2">No recent files found.</div>}
              </div>
          </div>
      </div>
    )
}

function LinkFile({file}: {file: string}){
    return(
        <a href={`/${file}`} className="ps-3 block hover:bg-pink-50 rounded-md truncate px-2 py-1 text-sm text-gray-700 mx-2 m-1">{ file }</a>
    )
}

export default HomePage