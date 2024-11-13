import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Navbar from './Navbar';



export default function Layout() {
    return (
        <View style={styles.container}>
            <Navbar />
            {/* Stack for handling navi */}
            <Stack />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});