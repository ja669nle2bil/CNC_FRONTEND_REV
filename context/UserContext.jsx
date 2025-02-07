import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { deleteToken, getToken } from '../services/storage';
import { CSHARP_API_URL, CSHARP_CONTAINER, PYTHON_API_URL } from '@env';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        console.error('Console: useUser must be used within a UserProvider');
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};


export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [tokenBalance, setTokenBalance] = useState(0);

    const fetchUserInfo = async () => {
        try {
            const token = await getToken('authToken');
            if (!token) {
                console.warn('No auth token found. User is not logged in.');
                return;
            }

            const userInfoResponse = await axios.get(`${CSHARP_API_URL}/api/auth/user-info`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { username, tokens } = userInfoResponse.data;

            setIsLoggedIn(true);
            setUsername(username);
            setTokenBalance(tokens);
        } catch (error) {
            // Check for a network error
            if (error.response) {
            // Server responded with a status code outside 2xx
                console.error('Server error while fetching user info:', error.response.data);
            } else if (error.request) {
            // Request made but no response received
                console.error('Network error: No response received');
            } else {
            // Other errors (e.g., configuration issues)
                console.error('Error in fetchUserInfo:', error.message);
            }

            // Handle token deletion only for specific errors
            if (!error.response || error.response.status === 401) {
                console.warn('Removing auth token due to error or unauthorized access.');
                await deleteToken('authToken');
            }

            setIsLoggedIn(false);
            setUsername('');
            setTokenBalance(0);
        }
    };

    console.log('UserProvider initialized:', { isLoggedIn, username, tokenBalance });
                
    const logout = async () => {
        try {
            console.log('Logging out...');
            // await AsyncStorage.removeItem('authToken');
            await deleteToken('authToken');
            setIsLoggedIn(false);
            setUsername('');
            setTokenBalance(0);
            console.log('Logout successful. State cleared.');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const login = async (token) => {
        await storeToken('authToken', token);
        await fetchUserInfo();
    };

    // default useEffect
    useEffect(() => {
        fetchUserInfo();
    }, []);


    console.log('UserProvider Context:', { isLoggedIn, username, tokenBalance });
    return (
        <UserContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                username,
                setUsername,
                tokenBalance,
                setTokenBalance,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Test-minimal config.
// export const UserProvider = ({ children }) => {
//     console.log('UserProvider rendered!');
//     // Minimal config:
//     return (
//         <UserContext.Provider value={{ /* context values */ }}>
//             {children}
//         </UserContext.Provider>
//     );
// };