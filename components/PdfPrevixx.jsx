import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { PYTHON_BACKEND_URL } from '@env';
// REACT NATIVE DOCUMENT PICKER APPORACH:
import DocumentPicker from 'react-native-document-picker';

const backendUrl = PYTHON_BACKEND_URL;

const PdfPrevixx = () => {
    const [fileUri, setFileUri] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [pdfIsLoading, setPdfIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [validationStatus, setValidationStatus] = useState(null);

    // Function to select and upload PDF
    const pickPdf = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
    
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    setUploadError(null);
                    setPdfIsLoading(true);
    
                    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InRlc3R1c2VyIiwidXNlcklkIjoiMSIsIm5iZiI6MTczNDAwMTQ4NiwiZXhwIjoxNzM0MDA1MDg2LCJpYXQiOjE3MzQwMDE0ODYsImlzcyI6IkF1dGhBUEkiLCJhdWQiOiJBdXRoQVBJVXNlcnMifQ.dlyT7Z9WYsjImeuWNFalj-BP-TJt2mPFACowGePxIvQ"; // Replace with dynamic token logic
                    const formData = new FormData();
                    formData.append('file', file);
    
                    const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    });
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to upload');
                    }
    
                    const { pdf_path } = await response.json();
                    setFileUri(URL.createObjectURL(file));
                    setPdfPath(pdf_path);
                    setValidationStatus('success');
                } catch (error) {
                    console.error('Error picking document:', error);
                    setUploadError('Failed to select the PDF file.');
                } finally {
                    setPdfIsLoading(false);
                }
            }
        };
    
        input.click();
    };    

    const handleConversion = async () => {
        if (!pdfPath) return;

        try {
            const drillAngle = 90;
            const drillActiveHeight = 30;
            const drillMovementSpeed = 30;

            const formData = new FormData();
            formData.append('pdf_path', pdfPath);
            formData.append('drill_angle', drillAngle);
            formData.append('drill_active_height', drillActiveHeight);
            formData.append('drill_movement_speed', drillMovementSpeed);

            const response = await fetch(`${backendUrl}/pdf/convert-pdf`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const gcodeContent = await response.text();
            const blob = new Blob([gcodeContent], { type: 'text/plain' });
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'converted.gcode';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            Alert.alert('Download complete', 'File saved to your computer.');
        } catch (error) {
            console.error('Error during conversion:', error);
            Alert.alert('Conversion Error', 'Failed to convert PDF.');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Select PDF" onPress={pickPdf} />
            {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
            {pdfIsLoading && <ActivityIndicator size="large" color="#0000ff" />}

            {validationStatus === 'success' && (
                <View style={styles.formContainer}>
                    <Text>Opening angle [degrees]: 90</Text>
                    <Text>Working height [mm]: 30</Text>
                    <Text>Feed rate [mm]: 30</Text>
                    <Button title="Convert to GCode" onPress={handleConversion} />
                </View>
            )}

            {fileUri && validationStatus === 'success' && (
                <View style={styles.pdfContainer}>
                    <WebView
                        source={{ uri: fileUri }}
                        style={styles.pdf}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    formContainer: {
        marginVertical: 20,
    },
    pdfContainer: {
        flex: 1,
        marginVertical: 20,
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    errorText: {
        color: 'red',
    },
});

export default PdfPrevixx;
