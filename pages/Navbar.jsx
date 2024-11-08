// version-early:
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Navbar() {
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
            {/* TODO: Test existing + add other links. */}
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
    },
    linkText: {
        color: '#fff',
        fontSize: 16,
    },
});