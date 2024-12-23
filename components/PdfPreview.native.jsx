import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import { getToken } from '../services/storage';
import { CSHARP_API_URL, PYTHON_BACKEND_URL } from '@env';
// expo-file-system or fetch for backend comm.
console.log('Using PdfPreview for native');

const backendUrl = PYTHON_BACKEND_URL;

const PdfPreview = () => {
    const [file, setFile] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [pdfIsLoading, setPdfIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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
    // React Native system for file receiving.
    const pickPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (result.type === 'success') {
                setFileUri(result.uri);
            } else {
                alert('Please select a valid PDF file');
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadError(null);
        setPdfIsLoading(true);

        try {
            const token = await getToken('authToken');
            if (!token) throw new Error('User is not authenticated');

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.type,
            });

            const response = await fetch(`${backendUrl}/pdf/upload-pdf`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
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

    return (
        <View style={StylesheetNamespace.container}>
            <Text style={styles.title}>PDF Preview & Conversion</Text>

            <TouchableOpacity onPress={handleFileChange} style={styles.button}>
                <Text style={styles.buttonText}>Select PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUpload} style={styles.button}>
                <Text style={styles.buttonText}>Upload PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={convertPdfToGcode} style={styles.button} disabled={conversionLoading}>
                <Text style={styles.buttonText}>{conversionLoading ? 'Converting...' : 'Convert to G-code'}</Text>
            </TouchableOpacity>

            {uploadError && <Text style={styles.error}>{uploadError}</Text>}
            {pdfIsLoading && <Text>Loading PDF...</Text>}

            {pdfUrl && (
                <Pdf
                    source={{ uri: pdfUrl }}
                    onLoadComplete={(numberOfPages) => setNumPages(numberOfPages)}
                    onPageChanged={(page) => setCurrentPage(page)}
                    onError={(error) => console.error(error)}
                    style={styles.pdf}
                />
            )}

            {pdfUrl && (
                <View style={styles.paginationContainer}>
                    <Button
                        title="Previous"
                        onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage <= 1}
                    />
                    <Text style={styles.paginationText}>
                        Page {currentPage} of {numPages}
                    </Text>
                    <Button
                        title="Next"
                        onPress={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}
                        disabled={currentPage >= numPages}
                    />
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
  