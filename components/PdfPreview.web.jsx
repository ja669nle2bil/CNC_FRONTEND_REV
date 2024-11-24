import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
// import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import { CSHARP_API_URL, PYTHON_BACKEND_URL } from '@env';
// expo-file-system or fetch for backend comm.
console.log('Using PdfPreview for web');

const backendUrl = PYTHON_BACKEND_URL;

const PdfPreview = () => {
    const [fileUri, setFileUri] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [pdfIsLoading, setPdfIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [validationStatus, setValidationStatus] = useState(null);

    // React Native system for file receiving.
    const pickPdf = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const fileURL = URL.createObjectURL(file);
                    setFileUri(fileURL);

                    // Uploading file directly via handleSubmit
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                        method: 'POST',
                        body: formData,
                    });

                    if(!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to upload');
                    }

                    const { pdf_path } = await response.json();
                    setPdfPath(pdf_path);
                    setValidationStatus('success');
                    validatePDF(pdf_path);
                } catch (error) {
                    console.error('Error picking document:', error);
                    setUploadError('Failed to select the PDF file.');
                }
            }
        };
        input.click();
    };

    const handleSubmit = async () => {
        if (!fileUri) return;
        setUploadError(null);
        setPdfIsLoading(true);

        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            const fileName = fileInfo.uri.split('/').pop() || 'default.pdf';

            const formData = new FormData();
            formData.append('file', {
                uri: fileUri,
                // name: fileInfo.uri.split('/').pop(),
                name: fileName,
                type: 'application/pdf',
            });

            const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload PDF');
            }

            const { pdf_path } = await response.json();
            setPdfPath(pdf_path);
            setPdfIsLoading(false);
            await validatePDF(pdf_path);
        } catch (error) {
            console.error('Error uploading PDF:', error);
            setUploadError(error.message);
        } finally {
            setPdfIsLoading(false);
        }
    };

    const validatePDF = async (pdfPath) => {
        const formData = new FormData();
        formData.append('pdf_path', pdfPath);

        const response = await fetch(`${backendUrl}/pdf/validate-pdf`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'File validation failed!');
        }

        const validationResult = await response.json();
        setValidationStatus(validationResult.isValid ? 'success' : 'error');
    };

    const handleConversion = async () => {
        if(!pdfPath) return;

        setConversionStatus('pending');
        const drillAngle = 90;
        const drillActiveHeight = 30;
        const drillMovementSpeed = 30;

        const formData = new FormData();
        formData.append('pdf_path', pdfPath);
        formData.append('drill_angle', drillAngle);
        formData.append('drill_active_height', drillActiveHeight);
        formData.append('drill_movement_speed', drillMovementSpeed);

        try {
            const response = await fetch(`${backendUrl}/pdf/convert-pdf`, {
                method: 'POST',
                body: formData,
            });

            if(response.ok) {
                const gcodeContent = await repsonse.text();
                const uri = FileSystem.documentDirectory + 'converted.gcode';
                await FileSystem.writeAsStringAsync(uri, gcodeContent, {encoding: FileSystem.EncodingType.UTF8});
                Alert.alert('Download complete', `File saved to ${uri}`);
                setConversionStatus('success');
            } else {
                throw new Error('Conversion failed');
            } 
        } catch (error) {
            console.error('Error during conversion:', error);
            setConversionStatus('failed');
        }
    };

    useEffect(() => {
        if (fileUri) {
            handleSubmit();
        }
    }, [fileUri]);

    return (
        <View style={styles.conatiner}>
            <Button title="Select PDF" onPress={pickPdf} />
            {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
            {pdfIsLoading && <ActivityIndicator size="large" color="#0000ff" />}

            {validationStatus === 'success' && (
                <View style={styles.formContainer}>
                    <Text>Opening angle [stopnia]: 90</Text>
                    <Text>Working height [mm]: 30</Text>
                    <Text>Feed rate [mm]: 30</Text>
                    <Button title="Convert to GCode" onPress={handleConversion} />
                </View>
            )}

            {pdfPath && validationStatus === 'success' && (
                <View style={styles.pdfContainer}>
                    <Pdf
                        source={{ uri: fileUri }}
                        onLoadComplete={(numPages) => setNumPages(numPages)}
                        style={styles.pdf}
                    />
                </View>
            )}
        </View>
    );
};

// style options.
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

export default PdfPreview;