import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
// import Pdf from 'react-native-pdf';  // unsupported
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';
import { getToken } from '../services/storage';
import { MOBILE_PYTHON_API_URL } from '@env';
import * as Sharing from 'expo-sharing';
// expo-file-system or fetch for backend comm.
console.log('Using PdfPreview for native');

const backendUrl = MOBILE_PYTHON_API_URL;

const PdfPreview = () => {
    const [file, setFile] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [pdfIsLoading, setPdfIsLoading] = useState(false);
    const [conversionLoading, setConversionLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(''); // URL for fetching PDF

    const handleFileChange = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setFile(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('File selection canceled');
            } else {
                console.error('Error selecting file:', err);
            }
        }
    }
    const pickPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Only allow PDF files
                copyToCacheDirectory: true,
            });
        
            console.log('Full Document Picker Result:', result);
        
            if (result.canceled === false && result.assets && result.assets.length > 0) {
                const file = result.assets[0]; // Access the first file in the assets array
                const isPdf = file.mimeType === 'application/pdf' || file.name.endsWith('.pdf');
        
                if (isPdf) {
                setFile(file); // File is valid, save it to state
                console.log('PDF file selected:', file);
                } else {
                alert('Please select a valid PDF file');
                }
            } else {
                alert('File selection canceled');
            }
        } catch (error) {
          console.error('Error picking document:', error);
          alert('An error occurred while selecting the file.');
        }
    };
      

    const handleUpload = async () => {
        if (!file) return;
        setUploadError(null);
        setPdfIsLoading(true);

        try {
            const token = await getToken('authToken');
            if (!token) throw new Error('User is not authenticated wse');

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: 'application/pdf',
                // type: file.type,
            });

            const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload PDF');

            const data = await response.json();
            setPdfPath(data.pdf_path);
            setPdfUrl(data.pdf_url);
        } catch (error) {
            console.error(error);
            setUploadError('Failed to upload PDF');
        } finally {
            setPdfIsLoading(false);
        }
    };

    const convertPdfToGcode = async () => {
        if (!pdfPath) {
            Alert.alert('Error', 'Please upload a PDF first');
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
            const path = `${FileSystem.documentDirectory}output.gcode`;
            await FileSystem.writeAsStringAsync(path, gcode);
            Alert.alert('Success', `G-code saved to: ${path}`);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to convert PDF to G-code');
        } finally {
            setConversionLoading(false);
        }
    };

    const shareGCode = async () => {
        try {
            const gcodeFileUri = `${FileSystem.documentDirectory}output.gcode`;
            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {
                await Sharing.shareAsync(gcodeFileUri);
            } else {
                Alert.alert('Sharing not available', 'This file cannot be shared on this device.');
            }
        } catch (error) {
            console.error('Error sharing file:', error);
            Alert.alert('Error', 'An error occurred while sharing the file.');
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>PDF Upload, Preview & Conversion</Text>

            <TouchableOpacity onPress={pickPdf} style={styles.button}>
                <Text style={styles.buttonText}>Select PDF</Text>
            </TouchableOpacity>

            {file && <Text style={styles.fileInfo}>Selected: {file.name}</Text>}

            <TouchableOpacity onPress={handleUpload} style={styles.button} disabled={pdfIsLoading}>
                {pdfIsLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Upload PDF</Text>
                )}
            </TouchableOpacity>

            {uploadError && <Text style={styles.error}>{uploadError}</Text>}

            <TouchableOpacity onPress={convertPdfToGcode} style={styles.button} disabled={conversionLoading}>
                {conversionLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Convert to G-code</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={shareGCode} style={styles.button}>
                <Text style={styles.buttonText}>Share G-code File</Text>
            </TouchableOpacity>

            {pdfUrl && (
                <View style={styles.pdfContainer}>
                    <Text style={styles.previewText}>PDF Preview:</Text>
                    <WebView source={{ uri: pdfUrl }} style={styles.pdf} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    button: { padding: 10, backgroundColor: '#007bff', borderRadius: 5, marginBottom: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    error: { color: 'red', marginTop: 10 },
    pdf: { flex: 1, width: Dimensions.get('window').width },
    paginationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    paginationText: { marginHorizontal: 10 },
  });
export default PdfPreview;