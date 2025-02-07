import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { CSHARP_API_URL, PYTHON_API_URL, PYTHON_PC, MOBILE_CSHARP_API_URL, MOBILE_PYTHON_API_URL } from '@env';
// import { Input, Button } from 'react-native-elements';
import { getToken, storeToken, deleteToken } from '../services/storage';
import { useUser } from '../context/UserContext';
import { Input, Button } from '@rneui/themed';

const CSHARP_EXEC = Platform.OS === 'ios' || Platform.OS === 'android' ? MOBILE_CSHARP_API_URL : CSHARP_API_URL;
const PYTHON_EXEC = Platform.OS === 'ios' || Platform.OS === 'android' ? MOBILE_PYTHON_API_URL : PYTHON_PC;


export default function AuthScreen({ onSuccessfulLogin }) {
    const { setIsLoggedIn, setUsername, setTokenBalance } = useUser();
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter your username and password');
            setErrorMessage('Please enter your username and password.');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            // Call the login endpoint
            const response = await axios.post(`${CSHARP_EXEC}/api/auth/login`, {
                username,
                password,
            });

            // Extract and display the JWT token
            const token = response.data.token;
            await storeToken('authToken', token);
            console.log('Token stored successfully');
            Alert.alert('Login Successful', 'You\'re now logged in!');
            console.log('JWT Token:', token);

            // Fetching token balance
            const balanceResponse = await axios.get(`${CSHARP_EXEC}/api/auth/check-tokens`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const tokenBalance = balanceResponse.data.tokens;

            console.log('Token balance fetched successfully:', tokenBalance);

            // Update context directly
            console.log('Updating context after successful login...');
            setIsLoggedIn(true);
            setUsername(username);
            setTokenBalance(tokenBalance);

            console.log('Context updated:', {
                isLoggedIn: true,
                username,
                tokenBalance,
            });

            // Optionally trigger parent handler (if needed)
            if (onSuccessfulLogin) {
                onSuccessfulLogin({ username, tokenBalance });
            }
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Registration handler
    const handleRegister = async () => {
        if(!username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill out all fields');
            setErrorMessage('All fields are required');
            setSuccessMessage('');
            return;
        }

        if(password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            setErrorMessage('Passwords do not match.');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Call the registration endpoint
            const response = await axios.post(`${CSHARP_EXEC}/api/auth/register`, {
                username,
                password,    
            });
            
            Alert.alert('Registration successful', response.data.message || 'You can now log in!');
            console.log('Registration response:', response.data);

            // Switch back to login mode after successful registration
            setSuccessMessage('Registration successful! You can now log in.');
            setIsRegisterMode(false);
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            // const serverMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            if (error.response?.status === 409) {
                // Handle the "username already exists" error
                setErrorMessage('A user with this username already exists. Please choose another username.');
            } else {
                // Handle other errors
                setErrorMessage('Registration failed. Please try again.');
            }
            setSuccessMessage('');
            console.error("Registration error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    

    // Python backend converter call.
    const callConverter = async () => {
        try {
            const token = await getToken();
            console.log("Retrieved token:", token);
            if (!token) {
                Alert.alert('Error', 'You must log in first.');
                return;
            }
            // Debugging Pyton.env
            console.log("API URL:", PYTHON_EXEC);
            const response = await axios.get(`${PYTHON_EXEC}/converter`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Converter Access", response.data.message);
            console.log("Converter response:", response.data);
        } catch (error) {
            Alert.alert("Access Denied", "Please log in to access this feature.");
            console.error("Access error:", error.response?.data || error.message); // Log errors
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegisterMode ? 'Register' : 'Login'}</Text>
    
            <Input
                placeholder="Username"
                value={username}
                onChangeText={setLocalUsername}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
            />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
            />
            {isRegisterMode && (
                <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                />
            )}
        
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
                <Text style={styles.successText}>{successMessage}</Text>
            ) : null}
        
            <Button
                title={isRegisterMode ? 'Register' : 'Login'}
                onPress={isRegisterMode ? handleRegister : handleLogin}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                loading={loading}
            />
            <Button
                title={isRegisterMode ? 'Switch to Login' : 'Switch to Register'}
                onPress={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage('');
                setSuccessMessage('');
                }}
                type="clear"
                titleStyle={styles.switchButtonText}
            />
        </View>
    );
}
        
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
        },
        inputContainer: {
            marginBottom: 15,
        },
        input: {
            width: '100%',
            textAlign: 'left',
            fontSize: 16,
            padding: 10,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#ccc',
        },
        errorText: {
            color: 'red',
            fontSize: 14,
            marginBottom: 10,
            textAlign: 'center',
        },
        successText: {
            color: 'green',
            fontSize: 14,
            marginBottom: 10,
            textAlign: 'center',
        },
        button: {
            backgroundColor: '#007bff',
            paddingVertical: 12,
            borderRadius: 8,
        },
        buttonContainer: {
            marginBottom: 10,
        },
        switchButtonText: {
            color: '#007bff',
            fontSize: 14,
    },
});