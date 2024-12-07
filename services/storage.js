import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Store a value
export async function storeToken(key, value) {
    if (Platform.OS === 'web') {
        // Usage of AsyncStorage on web
        await AsyncStorage.setItem(key, value);
    } else {
        // Usage of SecureStore for native platforms (mobile)
        await SecureStore.setItemAsync(key, value);
    }
}

// WHEN: Retrieving a value from storage
export async function getToken(key) {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
}

// Deleting retrieved value
export async function deleteToken(key) {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
    } else {
        
    }
}
// export const storeToken = async (token) => {
//     await SecureStore.setItemAsync('jwt_token', token);
// };

// export const getToken = async () => {
//     return await SecureStore.getItemAsync('jwt_token');
// };