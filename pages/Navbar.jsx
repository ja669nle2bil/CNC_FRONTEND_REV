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
            {/* TODO: add other links. */}
        </View>
    )
}