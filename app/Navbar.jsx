import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
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
                {/* Navigation Links */}
                <Link href="/" style={styles.link} key="Home">
                    <Text style={styles.linkText}>Home</Text>
                </Link>
                {['About', 'Converter', 'Documentation'].map((item) => (
                    <Link href={`/${item.toLowerCase()}`} style={styles.link} key={item}>
                        <Text style={styles.linkText}>{item}</Text>
                    </Link>
                ))}

                {/* User Section */}
                <View style={styles.userSection}>
                    {isLoggedIn ? (
                        <>
                            {/* Display Username and Token Balance */}
                            <Text style={styles.usernameText}>{`User: ${username}`}</Text>
                            <Text style={styles.balanceText}>{`Balance: ${tokenBalance} tokens`}</Text>

                            {/* Logout Button */}
                            <Button
                                title="Logout"
                                onPress={logout}
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonText}
                            />
                        </>
                    ) : (
                        <Button
                            title="Login/Register"
                            onPress={handleLoginPress}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                        />
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
                            <Button
                                title="Close"
                                onPress={closeModal}
                                buttonStyle={styles.closeButton}
                                titleStyle={styles.buttonText}
                            />
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
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ddd',
        marginTop: 'auto',
        marginBottom: 'auto',

    },
    link: {
        marginHorizontal: 10,
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    linkText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameText: {
        marginRight: 10,
        fontSize: 16,
    },
    balanceText: {
        marginRight: 10,
        fontSize: 16,
        color: 'green',
    },
    button: {
        backgroundColor: 'blue',
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 14,
        color: 'white',
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
        backgroundColor: 'red',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
