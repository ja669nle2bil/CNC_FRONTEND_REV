// version-early:
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Link } from 'expo-router';
import AuthScreen from '../components/AuthScreen';

export default function Navbar({ isLoggedIn, onProfilePress }) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLoginPress = () => {
        // Opening the modal (login popup)
        setIsModalVisible(true);
    }

    const closeModal = () => {
        // closing login popup option.
        setIsModalVisible(false);
    }
    return (
        <View style={styles.navbar}>
            <Link href="/" style={styles.link}>
                <Text style={styles.linkText}>Home</Text>
            </Link>
            <Link href="/about" style={styles.link}>
                <Text style={styles.linkText}>About</Text>
            </Link>
            <Link href="/converter" style={styles.link}>
                <Text style={styles.linkText}>Converter</Text>
            </Link>
            <Link href="/documentation" style={styles.link}>
                <Text style={styles.linkText}>Documentation</Text>
            </Link>
            
            {/* User Section */}
            <View style={styles.userSection}>
                {isLoggedIn ? (
                    // TO DO: Add /profile routing.
                    <Button
                        title="Profile"
                        onPress={onProfilePress}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonText}
                    />
                ) : (
                    <Link href="/login" style={styles.button}>
                        <Text style={styles.buttonText}>Login/Register</Text>
                    </Link>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#333',
    },
    link: {
        padding: 10,
        paddingHorizontal: 10,
    },
    linkText: {
        color: '#fff',
        fontSize: 16,
    },
    userSection: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});