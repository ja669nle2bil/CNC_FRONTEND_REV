import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
import { PYTHON_BACKEND_URL, PYTHON_PC } from '@env';
import { getToken } from '../services/storage';

// const backendUrl = PYTHON_BACKEND_URL;
const backendUrl = PYTHON_PC;

const PdfPreview = () => {
    const [file, setFile] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [pdfIsLoading, setPdfIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [conversionLoading, setConversionLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(''); // URL for fetching PDF

    useEffect(() => {
        if (file) handleUpload();
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
            if(!token) throw new Error('User is not authenticated whatsoever');

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload PDF');

            // const { pdf_path } = await response.json();
            // setPdfPath(pdf_path);
            // renderPdf(pdf_path);
            const data = await response.json();
            const pdfUrl = data.pdf_url; // Ensure correct field name from backend response
            const pdfPath = data.pdf_path;
            setPdfPath(pdfPath);
            console.log("PDF Path (relative):", data.pdf_path);
            setPdfUrl(pdfUrl);          // Save the PDF URL for rendering
            renderPdf(pdfUrl, 1);        // Pass the URL into renderPdf
        } catch (error) {
            console.error(error);
            setUploadError('Failed to upload PDF');
        } finally {
            setPdfIsLoading(false);
        }
    };

  // Render PDF using pdf.js
  const renderPdf = async (pdfUrl, pageNumber = 1) => {
    try {
        const pdf = await pdfjs.getDocument(pdfUrl).promise; // Load the PDF
        setNumPages(pdf.numPages);

        const container = document.getElementById('pdf-container'); // Container element
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        const page = await pdf.getPage(pageNumber);

        // Calculate scale based on container width
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = container.clientWidth; // Width of the container
        const scale = containerWidth / viewport.width;

        const scaledViewport = page.getViewport({ scale }); // Adjust the viewport

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
        setCurrentPage(pageNumber);
    } catch (error) {
        console.error('Error rendering PDF:', error);
    }
};


const convertPdfToGcode = async () => {
    if (!pdfPath) {
        alert('Please upload a PDF first');
        return;
    }
    setConversionLoading(true);

    try {
        const response = await fetch(`${backendUrl}/pdf/convert-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pdf_path: pdfPath,
                drill_angle: '45',
                drill_active_height: '0.1',
                drill_movement_speed: '1200',
            }),
        });

        if (!response.ok) throw new Error('Failed to convert PDF to G-code');

        const gcode = await response.text();
        const blob = new Blob([gcode], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.gcode';
        link.click();
    } catch (error) {
        console.error(error);
        alert('Failed to convert PDF to G-code');
    } finally {
        setConversionLoading(false);
    }
};

return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>PDF Preview & Conversion</h2>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ marginRight: '10px' }}
            />
            <button onClick={convertPdfToGcode} disabled={conversionLoading}>
                {conversionLoading ? 'Converting...' : 'Convert to G-code'}
            </button>
        </div>

        {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
        {pdfIsLoading && <p>Loading PDF...</p>}

        {pdfUrl && (
            <div id="pdf-container" style={{ margin: '0 auto', maxWidth: '80%', textAlign: 'center' }}>
                <canvas
                    id="pdf-canvas"
                    style={{
                        border: '1px solid #ccc',
                        marginTop: '20px',
                        display: 'block',
                        margin: '0 auto',
                        width: '120%', // Ensure canvas scales within the container
                    }}
                />
                <p>
                    Page {currentPage} of {numPages}
                </p>
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={() => handlePageChange(-1)}
                        disabled={currentPage <= 1}
                        style={{ marginRight: '10px' }}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage >= numPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        )}
    </div>
);
};

export default PdfPreview;