import { Stack, useSegments } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import Navbar from './Navbar';
import { useState } from 'react';
import { UserProvider, useUser } from '../context/UserContext';

export default function Layout() {
    console.log("Layout Component Rendered");

//     try {
//         const { isLoggedIn, username, tokenBalance } = useUser();
//         console.log('useUser:', useUser());
//         console.log("User Context in Layout:", { isLoggedIn, username, tokenBalance });

    return (
        <UserProvider>
            <View style={styles.container}>
                <Navbar />
                {/* Stack automatically handles route rendering */}
                <Stack
                    screenOptions={{
                        headerShown: Platform.OS !== 'web', // Show header on native platforms
                    }}
                />
            </View>
        </UserProvider>
    );
}

//             <View style={styles.container}>
//                 {/* <Navbar /> */}
//                 {/* <Stack
//                     screenOptions={{
//                         headerShown: Platform.OS !== 'web',
//                     }}
//                 /> */}
//                 <Navbar                    
//                     isLoggedIn={isLoggedIn}
//                     username={username}
//                     tokenBalance={tokenBalance}
//                 />
//                 <Stack />
//             </View>
//         );
//     } catch (error) {
//         console.error("Error in Layout Component:", error);
//         return (
//             // <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>Error: {error.message}</Text>
//             // </View>
//         );
//     }
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});