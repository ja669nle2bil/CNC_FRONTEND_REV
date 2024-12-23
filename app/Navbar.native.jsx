import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; // Import the useRouter hook
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { isLoggedIn, username, tokenBalance, logout } = useUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter(); // Use the router for programmatic navigation

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  // Function to navigate to Login/Register page
  const goToAuth = () => {
    setIsMenuVisible(false); // Close the menu if open
    router.push('/auth'); // Navigate to the auth page
  };

  return (
    <View style={styles.container}>
      {/* Hamburger Menu */}
      <View style={styles.topBar}>
        <Text style={styles.title}>CNCodifier</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navbar */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Link href="/">
            <Ionicons name="home-outline" size={24} color="white" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Link href="/about">
            <Ionicons name="information-circle-outline" size={24} color="white" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Link href="/converter">
            <Ionicons name="build-outline" size={24} color="white" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Link href="/documentation">
            <Ionicons name="document-text-outline" size={24} color="white" />
          </Link>
        </TouchableOpacity>
      </View>

      {/* Hamburger Menu Content */}
      {isMenuVisible && (
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Menu</Text>

          {/* Navigation Links */}
          <TouchableOpacity style={styles.menuButton}>
            <Link href="/">
              <Text style={styles.menuText}>Home</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Link href="/about">
              <Text style={styles.menuText}>About</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Link href="/converter">
              <Text style={styles.menuText}>Converter</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Link href="/documentation">
              <Text style={styles.menuText}>Documentation</Text>
            </Link>
          </TouchableOpacity>

          {/* Authentication Links */}
          {isLoggedIn ? (
            <>
              <Text style={styles.menuText}>{`User: ${username}`}</Text>
              <Text style={styles.menuText}>{`Token Balance: ${tokenBalance}`}</Text>
              <TouchableOpacity onPress={logout} style={styles.menuButton}>
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={goToAuth} style={styles.menuButton}>
              <Text style={styles.menuText}>Login/Register</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 40,
    paddingBottom: 0,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hamburger: {
    padding: 5,
  },
  bottomNavbar: {
    position: 'static',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    backgroundColor: '#333',
    paddingVertical: 10,
  },
  iconWrapper: {
    alignItems: 'center',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
//   Szerokosc menu
  menuButton: {
    width: '100%',
    marginVertical: 5,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  menuText: {
    fontSize: 16,
  },
//   Login + auth 
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
