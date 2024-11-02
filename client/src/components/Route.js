import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../css/App.css';

function Route({routeType, parameters, children}) {
    const data = useSelector((state) => state.data)['content'];
    const widths = useSelector((state) => state.widths)['content'];
    const saveDocument = async (filename) => {
        console.log(data['spreadsheet']);
        const values = [data['spreadsheet'], widths];
        const response = await fetch(`/save-data/${filename}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        const result = await response.json();
        if (result.success) {
            document.body.style.cursor = 'default';
            alert('Data saved successfully!');
            window.location.href = "/" + filename;
        } else {
            document.body.style.cursor = 'default';
            let recomendation = ''
            if (result.message.includes('Access is denied')) {
                recomendation = 'Please check if the file is open in another program.';
            }
            alert(result.message + "\n\n" + recomendation);
        }
    }
    const renameDocument = async (filename) => {
        const old_filename = window.location.pathname.split('/').pop();
        const response = await fetch(`/rename-data/${filename}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(old_filename),
        })
        const result = await response.json();
        if (result.success) {
            document.body.style.cursor = 'default';
            alert('Data saved successfully!');
            window.location.href = `/${filename}`;
        } else {
            document.body.style.cursor = 'default';
            let recomendation = ''
            if (result.message.includes('Access is denied')) {
                recomendation = 'Please check if the file is open in another program.';
            }
            alert(result.message + "\n\n" + recomendation);
        }
    }
    const downloadDocument = async () => {
        const filename = window.location.pathname.split('/').pop();
        document.body.style.cursor = 'wait';
        fetch(`/download/${filename}`, {
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
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);  // Clean up the URL
            document.body.style.cursor = 'default';
        })
        .catch(error => console.error('Download failed:', error));
    }
    const newDocument = () => {
        window.location.href = "/create-new-file"
    }   
    const handleOnClick = (e) => {
        switch (routeType) {
            case 'save':
                saveDocument(parameters); // Replace 'filename' with the actual filename
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
    const handleKeyDown = (event) => {
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

export default Route