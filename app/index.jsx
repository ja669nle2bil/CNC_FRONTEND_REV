// HOMEPAGE
import { useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function IndexPage() {
    const navigation = useNavigation();

    // hiding header accessibility.
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: Platform.OS !== 'web', // Show headers only on IOS/Android
        });
    }, [navigation])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to CNCodifier!</Text>
            <Text style={styles.description}>
                Welcome to the Home Page of CNCodifier!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});