import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import Navbar from './components/Navbar';
import { useUser } from './context/UserContext';
import Converter from './screens/Converter';
import RestrictedAccess from './screens/RestrictedAccess';
// import AuthScreen from './screens/AuthScreen';

export default function App() {
    return <Stack />;
}


// export default function App() {
//     const { isLoggedIn } = useUser(); // Access context here at the top level
//     console.log("App rendered. IsLoggedIn:", isLoggedIn);

//     return (
//         <View style={{ flex: 1 }}>
//             <Navbar />
//             <Stack>
//                 {/* Route Restriction for Converter */}
//                 <Stack.Screen name="Converter" component={isLoggedIn ? Converter : RestrictedAccess} />
//             </Stack>
//         </View>
//     );
// }