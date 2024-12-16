import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Store a value
export async function storeToken(key, value) {
    if (Platform.OS === 'web') {
        // Use sessionStorage for web to persist only for the session
        sessionStorage.setItem(key, value);
    } else {
        // Use SecureStore for native platforms (mobile)
        await SecureStore.setItemAsync(key, value);
    }
}

// Retrieve a value
export async function getToken(key) {
    if (Platform.OS === 'web') {
        return sessionStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
}

// Delete a value
export async function deleteToken(key) {
    if (Platform.OS === 'web') {
        sessionStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
}
