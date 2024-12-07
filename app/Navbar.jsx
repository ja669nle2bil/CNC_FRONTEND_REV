// version-early:
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Link } from 'expo-router';
import AuthScreen from '../components/AuthScreen';
import { useState } from 'react';

export default function Navbar({
    isLoggedIn,
    username,
    tokenBalance,
    onLogout,
    onAddTokens,
    onLoginPress, 
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLoginPress = () => {
        // Opening the modal (login popup)
        setIsModalVisible(true);
    }

    const closeModal = () => {
        // closing login popup option.
        setIsModalVisible(false);
    }

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
                    <>
                        {/* Display Username and Token Balance */}
                        <Text style={styles.usernameText}>{`User: ${username}`}</Text>
                        <Text style={styles.balanceText}>{`Balance: ${tokenBalance} tokens`}</Text>
                        
                        {/* Logout Button */}
                        <Button
                            title="Logout"
                            onPress={onLogout}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                        />
                        {/* Add Tokens Button */}
                        <Button
                            title="Add Tokens"
                            onPress={() => onAddTokens(10)} // Example: Adding 10 tokens
                            buttonStyle={[styles.button, { marginLeft: 10 }]}
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

            {/* Modal for Login/Register */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <AuthScreen
                                onSuccessfulLogin={(userInfo) => {
                                    onLoginPress(userInfo);
                                    closeModal();
                                }}
                        />
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF3B30',
    },
    userSection: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    usernameText: {
        marginRight: 10,
        fontSize: 16,
        color: '#333',
    },
    balanceText: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 10,
        fontSize: 16,
        color: '#007BFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
});