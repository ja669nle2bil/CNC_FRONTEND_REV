import React, { useSate, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-web';

const storeToken = async (token) => {
    await SecureStore.setIteamAsync('jwt_token', token);
};

const getToken = async () => {
    return await SecureStore.getItemAsync('jwt_token');
};

export default function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await axios.post('http://cs-url/api/auth/login', { username, password });
        const token = response.data.token;
        await storeToken(token);
        alert("Login successful!");
    };

    const callConverter = async () => {
        const token = await getToken();
        const response = await axios.get('http://python-url/converter', {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.message);
    };

    return (
        <View>
            <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
            <TextInput placeholder='Password' secureTextEntry onChangeText={setPassword} value={password} />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Access Converter" onPress={callConverter} />
        </View>
    )
}