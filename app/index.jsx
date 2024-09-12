// HOMEPAGE
import { View, Text, StyleSheet } from 'react-native';

export default function IndexPage() {
    return (
        <View style={StyleSheet.container}>
            <Text style={styles.text}>Welcome to the Home Page of CNCodifier!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});