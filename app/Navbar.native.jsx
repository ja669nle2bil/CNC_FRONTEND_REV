import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { isLoggedIn, username, tokenBalance, logout } = useUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

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

      {/* Hamburger Menu Modal */}
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menu</Text>

            {/* Navigation Options */}
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

            {/* Auth Options */}
            {isLoggedIn ? (
              <>
                <Text style={styles.menuText}>{`User: ${username}`}</Text>
                <Text style={styles.menuText}>{`Token Balance: ${tokenBalance}`}</Text>
                <TouchableOpacity onPress={logout} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Logout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.modalButton}>
                <Link href="/auth">
                  <Text style={styles.modalButtonText}>Login/Register</Text>
                </Link>
              </TouchableOpacity>
            )}

            {/* Close Button */}
            <TouchableOpacity onPress={toggleMenu} style={styles.modalCloseButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

// V2
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Link } from 'expo-router';
// import { useUser } from '../context/UserContext';

// export default function Navbar() {
//   const { isLoggedIn, username, tokenBalance, logout } = useUser();
//   const [isMenuVisible, setIsMenuVisible] = useState(false);

//   const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Top Navigation Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => console.log('Back Pressed')}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>CNCodifier</Text>
//       </View>

//       {/* Bottom Navbar */}
//       <View style={styles.bottomNavbar}>
//         <TouchableOpacity style={styles.iconWrapper}>
//           <Link href="/">
//             <Ionicons name="home-outline" size={24} color="white" />
//           </Link>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconWrapper}>
//           <Link href="/about">
//             <Ionicons name="information-circle-outline" size={24} color="white" />
//           </Link>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconWrapper}>
//           <Link href="/converter">
//             <Ionicons name="build-outline" size={24} color="white" />
//           </Link>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconWrapper}>
//           <Link href="/documentation">
//             <Ionicons name="document-text-outline" size={24} color="white" />
//           </Link>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={toggleMenu} style={styles.iconWrapper}>
//           <Ionicons name="menu-outline" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Hamburger Menu Modal */}
//       <Modal
//         visible={isMenuVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={toggleMenu}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContent}>
//             <ScrollView contentContainerStyle={styles.menuContainer}>
//               <Text style={styles.modalTitle}>Menu</Text>

//               {/* Navigation Options */}
//               <TouchableOpacity style={styles.menuButton}>
//                 <Link href="/" onPress={toggleMenu}>
//                   <Text style={styles.menuText}>Home</Text>
//                 </Link>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.menuButton}>
//                 <Link href="/about" onPress={toggleMenu}>
//                   <Text style={styles.menuText}>About</Text>
//                 </Link>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.menuButton}>
//                 <Link href="/converter" onPress={toggleMenu}>
//                   <Text style={styles.menuText}>Converter</Text>
//                 </Link>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.menuButton}>
//                 <Link href="/documentation" onPress={toggleMenu}>
//                   <Text style={styles.menuText}>Documentation</Text>
//                 </Link>
//               </TouchableOpacity>

//               {/* Auth Options */}
//               {isLoggedIn ? (
//                 <>
//                   <Text style={styles.menuText}>{`User: ${username}`}</Text>
//                   <Text style={styles.menuText}>{`Balance: ${tokenBalance}`}</Text>
//                   <TouchableOpacity onPress={logout} style={styles.modalButton}>
//                     <Text style={styles.modalButtonText}>Logout</Text>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <TouchableOpacity style={styles.modalButton}>
//                   <Link href="/auth" onPress={toggleMenu}>
//                     <Text style={styles.modalButtonText}>Login/Register</Text>
//                   </Link>
//                 </TouchableOpacity>
//               )}

//               {/* Close Button */}
//               <TouchableOpacity onPress={toggleMenu} style={styles.modalCloseButton}>
//                 <Text style={styles.modalButtonText}>Close</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     padding: 10,
//     backgroundColor: '#eee',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   bottomNavbar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     paddingVertical: 10,
//   },
//   iconWrapper: {
//     alignItems: 'center',
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '100%',
//     backgroundColor: 'white',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   menuContainer: {
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   menuButton: {
//     width: '100%',
//     marginVertical: 5,
//     paddingVertical: 10,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   menuText: {
//     fontSize: 16,
//   },
//   modalButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     width: '100%',
//     alignItems: 'center',
//   },
//   modalCloseButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     width: '100%',
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });
