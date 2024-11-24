import { Stack, useSegments } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import Navbar from './Navbar';

export default function Layout() {
    // Getting the current segment (active route)
    const segments = useSegments();

    // Checking if the current route is the index page.
    const isHomePage = segments.length === 0 || segments[0] === '';

    return (
        <View style={styles.container}>
            <Navbar />
            {/* Stack for handling navi */}
            <Stack 
                screenOptions={{
                    headerShown: Platform.OS !== 'web', // Visible headers exclusively on mobile.
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});