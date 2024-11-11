import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store';
import axios from 'axios';

import '../css/App.css';

interface RouteProps {
    routeType: 'save' | 'download' | 'new_document' | 'rename';
    parameters: any;
    children: React.ReactElement;
}

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
    }
    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (routeType) {
            case 'rename':
                if (event.key === 'Enter') {
                    renameDocument(parameters);
                }
                break;
        }
    }
    return React.cloneElement(children, {
        onClick: handleOnClick,
        onKeyDown: handleKeyDown,
    });
    
}

export const saveDocument = async (filename: string, data: any, widths: any) => {
    console.log(data['spreadsheet']);
    const values = [data['spreadsheet'], widths];
    const response = await fetch(`api/save-data/${filename}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    })
    const result = await response.json();
    if (result.success) {
        document.body.style.cursor = 'default';
        window.ipcRenderer.send('show-alert', { title: 'Success! ⸜(｡˃ ᵕ ˂ )⸝♡', message: 'Data saved successfully' });
        window.location.href = `/${filename.replace(' ', '_')}`;
    } else {
        document.body.style.cursor = 'default';
        let recomendation = ''
        if (result.message.includes('Access is denied')) {
            recomendation = 'Please check if the file is open in another program.';
        }
        window.ipcRenderer.send('show-alert', { title: 'Error ｡°(°.◜ᯅ◝°)°｡', message: result.message + "\n\n" + recomendation });
    }
}
export const renameDocument = async (filename:string) => {
    const old_filename = window.location.pathname.split('/').pop();
    const response = await fetch(`api/rename-data/${filename}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(old_filename),
    })
    const result = await response.json();
    if (result.success) {
        document.body.style.cursor = 'default';
        window.ipcRenderer.send('show-alert', { title: 'Success! ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧', message: 'Data saved successfully' });
        window.location.href = `/${filename.replace(' ', '_')}`;
    } else {
        document.body.style.cursor = 'default';
        let recomendation = ''
        if (result.message.includes('Access is denied')) {
            recomendation = 'Please check if the file is open in another program.';
        }
        window.ipcRenderer.send('show-alert', { title: 'Error ｡°(°.◜ᯅ◝°)°｡', message: result.message + "\n\n" + recomendation });
        alert();
    }
}
export const downloadDocument = async () => {
    const filename = window.location.pathname.split('/').pop();
    document.body.style.cursor = 'wait';
    fetch(`api/download/${filename}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.blob();  // convert the response to a blob
        }
        throw new Error('Network response was not ok.');
    })
    .then(blob => {
        // Create a link element, set it up to download the file, and click it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || '';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);  // Clean up the URL
        document.body.style.cursor = 'default';
    })
    .catch(error => console.error('Download failed:', error));
}
export const newDocument = () => {
    axios.get('/api/create-new-file')
    .then(response => {
        const filename = response.data.filename; // assuming the API response contains a 'filename' field
        console.log('New document created:', filename);
        window.location.href = `/${filename.replace(' ', '_')}`;
    })
    .catch(error => {
    console.error('There was an error with the request:', error);
    });
}   
export const deleteDocument = async (filename: string) => {
    document.body.style.cursor = 'wait';
    axios.delete(`/api/delete-file/${filename.replace(' ', '_')}`)
    .then(()=> {
        window.ipcRenderer.send('show-alert', { title: 'Success! ｡^‿^｡', message: 'File deleted successfully!' });
        window.location.href = '/';
    })
    .catch(error => {
        window.ipcRenderer.send('show-alert', { title: 'Error (ᵕ—ᴗ—)', message: error });
    })
    .finally(() => {
        document.body.style.cursor = 'default';
    });
}