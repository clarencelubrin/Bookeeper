<<<<<<< HEAD
import { NavigateFunction } from 'react-router-dom';
import { DefaultTheme } from 'src/interfaces/Theme/ThemeInterfaces';

let theme = DefaultTheme;
function useAPI(url: string, thenFunction: (response: any) => void, catchFunction?: (response: any) => void, parameters?: any) {
    if (window.ipcRenderer) {
        window.ipcRenderer.send('api-fetch', {url, parameters});
        // Listen for the response from the main process
        const handleResponse = (_: any, response: any) => {
            // then do something with the response
            if (response.success) {
                thenFunction(response);
            }
            else if(catchFunction) {
                catchFunction(response);
            }
        };
        window.ipcRenderer.on('api-response', handleResponse);
        // Clean up the event listener when the component unmounts
        return () => {
            window.ipcRenderer.removeListener('api-response', handleResponse);
        };  
=======
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store';
import axios from 'axios';
import { DefaultTheme } from 'src/interfaces/Theme/ThemeInterfaces';
import { RouteProps } from 'src/interfaces/Route/RouteInterface';
import 'css/App.css';

let theme = DefaultTheme;
export function Route({ routeType, parameters = null, children }: RouteProps) {
    const data = useSelector((state: RootState) => state.data)['present']['content'];
    const widths = useSelector((state: RootState) => state.widths)['content'];
    const handleOnClick = () => {
        switch (routeType) {
            case 'save':
                saveDocument(parameters, data, widths); // Replace 'filename' with the actual filename
                break;
            case 'download':
                downloadDocument();
                break;
            case 'new_document':
                newDocument();
                break;
            default:
                console.log('Invalid route type');
        }
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    }
}
export const saveDocument = async (filename: string, data: any, widths: any, navigate: NavigateFunction) => {
    const values = [data['spreadsheet'], widths];
    console.log('TO BE SENT', values)
    if (filename === '' || filename === undefined) {
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR, message: 'Filename cannot be empty' });
        return;
    }
    useAPI(
    `save-data/${filename}`, 
    () => {
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_SUCCESS, message: 'Data saved successfully' });
        navigate(`/${filename.replace(' ', '_')}`);
        window.location.reload();
    },
    (response: any) => {
        let recomendation = ''
        if (response.message.includes('Access is denied')) {
            recomendation = 'Please check if the file is open in another program.';
        }
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR, message: response.message + "\n\n" + recomendation });
    }, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });
    document.body.style.cursor = 'default';
}
export const renameDocument = async (filename:string, old_filename: string, navigate: NavigateFunction) => {

    if (filename.replace('.xlsx','') === '' || filename === undefined || old_filename.replace('.xlsx','')  === '' || old_filename === undefined) {
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR, message: 'Filename cannot be empty' });
        return;
    }
    useAPI(
    `rename-data/${filename}`,
    () => {
        document.body.style.cursor = 'default';
<<<<<<< HEAD
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_SUCCESS_VAR_1, message: 'Data saved successfully' });
        navigate(`/${filename.replace(' ', '_')}`);
        window.location.reload();
    },
    (response: any) => {
=======
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_SUCCESS, message: 'Data saved successfully' });
        window.location.href = `/${filename.replace(' ', '_')}`;
    } else {
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
        document.body.style.cursor = 'default';
        let recomendation = ''
        if (response.message.includes('Access is denied')) {
            recomendation = 'Please check if the file is open in another program.';
        }
<<<<<<< HEAD
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR_VAR_1, message: response.message + "\n\n" + recomendation });
        alert();
    },
    {
=======
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_ERROR, message: result.message + "\n\n" + recomendation });
    }
}
export const renameDocument = async (filename:string) => {
    const old_filename = window.location.pathname.split('/').pop();
    const response = await fetch(`api/rename-data/${filename}`, {
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(old_filename),
<<<<<<< HEAD
    });
=======
    })
    const result = await response.json();
    if (result.success) {
        document.body.style.cursor = 'default';
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_SUCCESS_VAR_1, message: 'Data saved successfully' });
        window.location.href = `/${filename.replace(' ', '_')}`;
    } else {
        document.body.style.cursor = 'default';
        let recomendation = ''
        if (result.message.includes('Access is denied')) {
            recomendation = 'Please check if the file is open in another program.';
        }
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_ERROR_VAR_1, message: result.message + "\n\n" + recomendation });
        alert();
    }
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
}

export const newDocument = (navigate: NavigateFunction) => {
    useAPI('create-new-file',
    (response: any) => {
        const filename = response.data.filename; // assuming the API response contains a 'filename' field
        console.log('New document created:', filename);
        navigate(`/${filename.replace(' ', '_')}`);
        window.location.reload();
    });
}   
export const deleteDocument = async (filename: string, navigate: NavigateFunction) => {
    document.body.style.cursor = 'wait';
    if (filename === '' || filename === undefined) {
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR, message: 'Filename cannot be empty' });
        return;
    }
    useAPI(
    `delete-file/${filename.replace(' ', '_')}`,
    () => {
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_SUCCESS_VAR_2, message: 'File deleted successfully!' });
        navigate('/');
        window.location.reload();

    }, 
    (response: any) => {
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR_VAR_1, message: response.message });
    }
    );
    document.body.style.cursor = 'default';
}
export const downloadDocument = async (filename: string) => {
    document.body.style.cursor = 'wait';
    if (filename === '' || filename === undefined) {
        window.ipcRenderer.send('show-error', { title: theme.text.ALERT_ERROR, message: 'Filename cannot be empty' });
        return;
    }
    fetch(`http://localhost:5000/download/${filename}`, {
        method: 'GET',
    }).then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || '';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);  // Clean up the URL
        document.body.style.cursor = 'default';
        window.location.reload();
    }
)
}
export const uploadDocument = async (file: File, navigate: NavigateFunction) => {
    document.body.style.cursor = 'wait';
<<<<<<< HEAD
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
    console.log(data);
    navigate(`/${data.filename.replace(' ', '_')}`);
    window.location.reload();
=======
    axios.delete(`/api/delete-file/${filename.replace(' ', '_')}`)
    .then(()=> {
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_SUCCESS_VAR_2, message: 'File deleted successfully!' });
        window.location.href = '/';
    })
    .catch(error => {
        window.ipcRenderer.send('show-alert', { title: theme.text.ALERT_ERROR_VAR_1, message: error });
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    })
    .catch(error => console.error('Error:', error));
    document.body.style.cursor = 'default';
}