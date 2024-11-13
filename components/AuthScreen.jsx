import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { storeToken, getToken } from '../services/storage';

export default function AuthScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/AuthApiC#', {
                username,
                password,
            });
            const token = response.data.token;
            await storeToken(token);
            Alert.alert('Login Successful', 'You\'re now logged in!');
        } catch (error) {
            Alert.alert("Login Failed", "Please check your credentials and try again.");
            console.error("Login error:", error);
        }
    };

    const callConverter = async () => {
        try {
            const token = await getToken();
            const response = await axios.get('/PythonBackend-url', {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Converter Access", response.data.message);
            console.log("Converter response:", response.data);
        } catch (error) {
            Alert.alert("Access Denied", "Please log in to access this feature.");
            console.error("Access error:", error);
        }
    };

    return (
        <View>
            <TextInput
                placeholder='Username'
                onChangeText={setUsername}
                value={username}
                style={{ marginBottom: 10, padding: 8, borderWidth: 1, borderRadius: 5 }}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                style={{ marginBottom: 10, padding: 8, borderWidth: 1, borderRadius: 5 }}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Access Converter" onPress={callConverter} />
        </View>
    );
}