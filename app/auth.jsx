import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthScreen from '../components/AuthScreen'; // Adjust path if necessary

export default function AuthPage() {
  return (
    <View style={styles.container}>
        <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});
