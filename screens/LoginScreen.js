import { TextInput } from "react-native-gesture-handler";

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            // store jwt (token) in asyncsotrage or context field
            console.log('Login successful, token:', response.data.token);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <View>
            <Text>Username:</Text>
            <TextInput onChangeText={setUsername} value={username} />
            <Text>Password:</Text>
            <TextInput onChangeText={setPassword} value={password} secureTextEntry />
            <Button title="Login" onPress={login} />
        </View>
    )
}