import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PdfPreview from '../components/PdfPreview.web';
import { useUser } from '../context/UserContext';
// TODO: import PdfPreview component

export default function Converter() {
    const { isLoggedIn } = useUser() || {};
    console.log('Converter received isLoggedIn:', isLoggedIn);
    
    // Missing context handler
    if (!isLoggedIn) {
        return (
            <View style={styles.container}>
                <Text style={styles.restrictedText}>
                    To use this feature, please log in first.
                </Text>
            </View>
        );
    }

    // Render main component if logged in
    return (
        <View style={styles.app}>
            <View style={styles.card}>
                <View style={styles.converter}>
                    <Text style={styles.heading}>GENERATE GCODE FOR YOUR DOCUMENT</Text>
                    <View style={styles.spanCard}></View>
                    <Text style={styles.subheading}>We strongly advise to use 'Google Docs' PDFs for better results.</Text>
                    <PdfPreview />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    restrictedText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    card: {
        margin: 20,
        padding: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 3,
    },
    converter: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subheading: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    spanCard: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: '100%',
    },
    
})