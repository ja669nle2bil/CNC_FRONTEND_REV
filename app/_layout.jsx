import { Stack, useSegments } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import Navbar from './Navbar';
import { useState } from 'react';

export default function Layout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [tokenBalance, setTokenBalance] = useState(0);
    // Getting the current segment (active route)
    const segments = useSegments();

    const handleSuccessfulLogin = ({ username, tokenBalance }) => {
        setIsLoggedIn(true);
        setUsername(username);
        setTokenBalance(tokenBalance);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setTokenBalance(0);
    };

    return (
        <View style={styles.container}>
            <Navbar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn} // Optional: not directly used but can be passed
                username={username}
                tokenBalance={tokenBalance}
                onLogout={handleLogout}
                onLoginPress={handleSuccessfulLogin}
            />
            <Stack
                screenOptions={{
                    headerShown: Platform.OS !== 'web', // Visible headers exclusively on mobile
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
});