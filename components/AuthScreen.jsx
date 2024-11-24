import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { storeToken, getToken } from '../services/storage';
import { CSHARP_API_URL, PYTHON_API_URL } from '@env';
import { Input, Button, ActivityIndicator } from 'react-native-elements';

export default function AuthScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter your username and password');
            return;
        }

        setLoading(true);

        try {
            // Call the login endpoint
            const response = await axios.post(`${CSHARP_API_URL}/api/auth/login`, {
                username,
                password,
            });

            // Extract and display the JWT token
            const token = response.data.token;
            await storeToken(token);
            Alert.alert('Login Successful', 'You\'re now logged in!');
            console.log('JWT Token:', token);
        } catch (error) {
            Alert.alert("Login Failed", "Please check your credentials and try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Python backend converter call.
    const callConverter = async () => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'You must log in first.');
                return;
            }
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
                placeholder='Username'
                onChangeText={setUsername}
                value={username}
                style={{ marginBottom: 10, padding: 8, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', }}
            />
            <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                style={{ marginBottom: 10, padding: 8, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', }}
            />
            <Button title="Login" onPress={handleLogin} disabled={loading} loading={loading} />
            {/* Loading indicator appearance during login session */}
            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}
            
            {/* Converter button access */}
            <View style={{ marginTop: 20 }}>
                <Button title="Access Converter" onPress={callConverter} />
            </View>
        </View>
    );
}