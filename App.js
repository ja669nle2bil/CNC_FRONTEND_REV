import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './pages/Navbar';
import "expo-router/entry";
import AuthScreen from './components/AuthScreen';
import { useRouter } from 'expo-router';

export default function App() {
    // Navi usage.
    const router = useRouter(); 
    // Tracking login state.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Controlling auth module
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

    // Functionability for operating profile button
    const onProfilePress = () => {
        if (isLoggedIn) {
            router.push('/profile');
        } else {
            alert('You need to log in first.');
        }
    };

    // Functionability for Login/Register button
    const onLoginPress = () => {
        // Open the authentication modal screen.
        setIsAuthModalVisible(true);    
    };

    // Functionability for closing Authentication modal
    const closeAuthModal = () => {
        setIsAuthModalVisible(false);
    }

    // Functionability of handling successful login-positive
    const handleSuccessLogin = () => {
        setIsLoggedIn(true);
        setIsAuthModalVisible(false);
    };

    return (
        <View style={StyleSheet.container}>
            {/* Navbar setup with login + profile handlers */}
            <Navbar
                isLoggedIn={isLoggedIn}
                onProfilePress={onProfilePress}
                onLoginPress={onLoginPress}
            />
            {/* The stack component for handling routing and screen navi */}
            <Stack />

            {/* Auth Modal */}
            {isAuthModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <AuthScreen
                            onClose={closeAuthModal}
                            onSuccessfulLogin={handleSuccessLogin}
                        />
                    </View>
                </View>
            )}
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