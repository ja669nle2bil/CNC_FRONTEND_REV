import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
import { PYTHON_BACKEND_URL } from '@env';
import { getToken } from '../services/storage';

const backendUrl = PYTHON_BACKEND_URL;

const PdfPreview = () => {
    const [file, setFile] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [pdfIsLoading, setPdfIsLoading] = useState(false);

    useEffect(() => {
        if (file) {
            handleUpload();
        }
    }, [file]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile.type !== 'application/pdf') {
            alert('Please select a valid PDF file');
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadError(null);
        setPdfIsLoading(true);

        try {
            const token = await getToken('authToken');
            if(!token) {
                throw new Error('User is not authenticated whatsoever');
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload PDF');
            }

            const { pdf_path } = await response.json();
            setPdfPath(pdf_path);
            renderPdf(pdf_path);
        } catch (error) {
            console.error(error);
            setUploadError('Failed to upload PDF');
        } finally {
            setPdfIsLoading(false);
        }
    };

    const renderPdf = async (path) => {
        try {
            const pdf = await pdfjs.getDocument(path).promise;
            setNumPages(pdf.numPages);

            const canvas = document.getElementById('pdf-canvas');
            const ctx = canvas.getContext('2d');
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: ctx,
                viewport,
            };

            await page.render(renderContext).promise;
        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
            {pdfIsLoading && <p>Loading PDF...</p>}
            {pdfPath && (
                <div>
                    <canvas id="pdf-canvas" style={{ border: '1px solid #ccc', marginTop: '20px' }} />
                    <p>Number of pages: {numPages}</p>
                </div>
            )}
        </div>
    );
};

export default PdfPreview;
