import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './pages/Navbar';

export default function App() {
    return (
        <View style={StyleSheet.container}>
            <Navbar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});