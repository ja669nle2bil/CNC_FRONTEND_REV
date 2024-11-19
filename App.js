import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './pages/Navbar';
import "expo-router/entry";
import AuthScreen from './components/AuthScreen';

export default function App() {
    return (
        <View style={StyleSheet.container}>
            <Navbar />
            {/* The stack component for handling routing and screen navi */}
            <Stack />
            <AuthScreen />
        </View>
    );
    // return <AuthScreen />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});