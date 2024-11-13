import * as SecureStore from 'expo-secure-store';

export const storeToken = async (token) => {
    await SecureStore.setItemAsync('jwt_token', token);
};

export const getToken = async () => {
    return await SecureStore.getItemAsync('jwt_token');
};