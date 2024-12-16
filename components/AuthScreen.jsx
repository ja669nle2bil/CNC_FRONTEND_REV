import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { CSHARP_API_URL, CSHARP_CONTAINER, PYTHON_API_URL } from '@env';
import { Input, Button } from 'react-native-elements';
import { ActivityIndicator, Text } from 'react-native';
import { getToken, storeToken, deleteToken } from '../services/storage';
import { useUser } from '../context/UserContext';

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
            const response = await axios.post(`${CSHARP_API_URL}/api/auth/login`, {
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
            const balanceResponse = await axios.get(`${CSHARP_API_URL}/api/auth/check-tokens`, {
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
            const response = await axios.post(`${CSHARP_API_URL}/api/auth/register`, {
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
            console.log("API URL:", PYTHON_API_URL);
            const response = await axios.get(`${PYTHON_API_URL}/converter`, {
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
        <View style={{ padding: 20 }}>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={setLocalUsername}
                containerStyle={{ marginBottom: 10 }}
                inputContainerStyle={{
                    padding: 8,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#ccc',
                }}
            />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                containerStyle={{ marginBottom: 10 }}
                inputContainerStyle={{
                    padding: 8,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#ccc',
                }}
            />
            {isRegisterMode && (
                <Input
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    containerStyle={{ marginBottom: 10 }}
                    inputContainerStyle={{
                        padding: 8,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#ccc',
                    }}
                />
            )}
            {errorMessage ? (
                <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
                <Text style={{ color: 'green', marginBottom: 10 }}>{successMessage}</Text>
            ) : null}
            <Button
                title={isRegisterMode ? "Register" : "Login"}
                onPress={isRegisterMode ? handleRegister : handleLogin}
                disabled={loading}
                loading={loading}
            />
            <Button
                title={isRegisterMode ? "Switch to Login" : "Switch to Register"}
                onPress={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setErrorMessage(''); // Clear messages when toggling
                    setSuccessMessage('');
                }}
                containerStyle={{ marginTop: 10 }}
            />
        </View>
    );
}