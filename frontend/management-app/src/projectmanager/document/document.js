import { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import './document.css'
import api from '../api/axiosInstance.js'
import DocumentEditor from './editor.js'

export default function Document(props){
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(props.fileId)

    useEffect(() => {
        if (!props.fileId) {
            console.error('fileId is undefined');
            console.log(props.fileId + "is defined")
            return; // Exit early if fileId is undefined
        }

        const fetchDocumentContent = async () => {
            setLoading(true); // Start loading

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/fetch_document_content', {
                    params: { doc_id: props.fileId },
                    withCredentials: true
                });

                setContent(response.data.content); // Set the content
            } catch (err) {
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchDocumentContent();
    }, [props.fileId]); // Run when docId changes

    if (loading) {
        return <div>Loading...</div>; // Display loading text
    }

    if (error) {
        return <div className='error-message'>Error: {error}</div>; // Display error message
    }

    return (
        <div className='doc-holder'>
            {props.fileId}
            ---
            {props.pageType}
            ---
            {props.pageName}
            ---
            {content}


            <div>
                <DocumentEditor content={ content } doc_id={ props.fileId }/>
            </div>
        </div>
    )
}