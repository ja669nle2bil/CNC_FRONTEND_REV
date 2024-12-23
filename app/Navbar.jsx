import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-elements';
import AuthScreen from '../components/AuthScreen';
import { useUser } from '../context/UserContext';

export default function Navbar() {
    try {
        const { isLoggedIn, username, tokenBalance, logout } = useUser();
        console.log('Navbar context values:', { isLoggedIn, username, tokenBalance });

        const [isModalVisible, setIsModalVisible] = useState(false);

        const handleLoginPress = () => setIsModalVisible(true);
        const closeModal = () => setIsModalVisible(false);

        return (
            <View style={styles.navbar}>
                {/* Left Section - Navigation Links */}
                <View style={styles.leftSection}>
                    <Link href="/" style={styles.link} key="Home">
                        <Text style={styles.linkText}>Home</Text>
                    </Link>
                    {['About', 'Converter', 'Documentation'].map((item) => (
                        <Link href={`/${item.toLowerCase()}`} style={styles.link} key={item}>
                            <Text style={styles.linkText}>{item}</Text>
                        </Link>
                    ))}
                </View>

                {/* Right Section - User Info and Actions */}
                <View style={styles.userSection}>
                    {isLoggedIn ? (
                        <>
                            <Text style={styles.usernameText}>{`User: ${username}`}</Text>
                            <Text style={styles.balanceText}>{`Balance: ${tokenBalance} tokens`}</Text>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    { opacity: pressed ? 0.8 : 1 },
                                ]}
                                onPress={logout}
                            >
                                <Text style={styles.buttonText}>Logout</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { opacity: pressed ? 0.8 : 1 },
                            ]}
                            onPress={handleLoginPress}
                        >
                            <Text style={styles.buttonText}>Login/Register</Text>
                        </Pressable>
                    )}
                </View>

                {/* Login/Register Modal */}
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <AuthScreen onSuccessfulLogin={closeModal} />
                            <Pressable
                                style={({ pressed }) => [
                                    styles.closeButton,
                                    { opacity: pressed ? 0.8 : 1 },
                                ]}
                                onPress={closeModal}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>

        );
    } catch (error) {
        console.error("Navbar Error:", error);

        // Display fallback UI in case of error
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>An error occurred: {error.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Align left and right sections
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#4A90E2', // Modern blue background
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
    },
    leftSection: {
        flexDirection: 'row', // Horizontal alignment for links
        alignItems: 'center', // Center links vertically
    },
    link: {
        marginHorizontal: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent button background
    },
    linkText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameText: {
        marginRight: 10,
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    balanceText: {
        marginRight: 10,
        fontSize: 14,
        color: '#FFD700', // Golden color for token balance
    },
    button: {
        backgroundColor: '#FFD700', // Gold button color
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#FF3B3B',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
});
