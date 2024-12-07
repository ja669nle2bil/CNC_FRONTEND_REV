import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './pages/Navbar';
import "expo-router/entry";
import AuthScreen from './components/AuthScreen';
import { useRouter } from 'expo-router';

export default function App() {
    // Navi usage.
    const router = useRouter(); 
    const [username, setUsername] = useState('');
    // Tracking login state.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
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
    const handleSuccessfulLogin = async ({ username, tokenBalance }) => {
        setIsLoggedIn(true);
        setUsername(username);
        setTokenBalance(tokenBalance);
        setIsAuthModalVisible(false);

        // Fetch token balance for the logged-in user
        try {
            const token = await getToken('authToken');
            const response = await axios.get(`${CSHARP_API_URL}/api/auth/check-tokens`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTokenBalance(response.data.tokens);
        } catch (error) {
            console.error('Failed to fetch token balance:', error.response?.data || error.message);
            setTokenBalance(0);
        }
    };

    // logout functionabilit2y
    const handleLogout = async () => {
        await deleteToken('authToken');
        setIsLoggedIn(false);
        setUsername('');
        setTokenBalance(0);
        // Home screen navigation.
        router.push('/');
    };

    const useToken = async () => {
        try {
            const token = await getToken('authToken');
            const response = await axios.post(
                `${CSHARP_API_URL}/api/auth/use-token`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTokenBalance(response.data.remainingTokens);
            alert(response.data.message);
        } catch (error) {
            console.error('Token usage error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to use token.');
        }
    };

    const addTokens = async (amount) => {
        try {
            const token = await getToken('authToken');
            const response = await axios.post(
                `${CSHARP_API_URL}/api/auth/add-tokens`,
                { amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTokenBalance(response.data.totalTokens);
            // success message?
            alert(response.data.message);
        } catch (error) {
            console.error('Token addition error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to add tokens.');
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <Navbar
                isLoggedIn={isLoggedIn}
                username={username}
                tokenBalance={tokenBalance}
                onLogout={handleLogout}
                onAddTokens={addTokens}
                onLoginPress={() => setIsAuthModalVisible(true)}
            />
            <Stack />
            {isAuthModalVisible && (
                <AuthScreen onSuccessfulLogin={handleSuccessfulLogin} />
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
});