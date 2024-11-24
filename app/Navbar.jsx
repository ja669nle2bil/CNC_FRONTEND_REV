// version-early:
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Link } from 'expo-router';

export default function Navbar({ isLoggedIn, onProfilePress, onLoginPress }) {
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