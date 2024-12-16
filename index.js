import 'expo-router/entry'
import { UserProvider } from './context/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import Layout from './app/_layout';
// MainNavigator, main component

// Test Environment:
// export default function Main() {
//     return (
//         <UserProvider>
//             <SafeAreaProvider>
//                 <NavigationContainer>
//                     <App />
//                 </NavigationContainer>
//             </SafeAreaProvider>
//         </UserProvider>
//     );
// }

// const Stack = createStackNavigator();

// export default function Main() {
//     return (
//         <UserProvider>
//             <SafeAreaProvider>
//                 <NavigationContainer>
//                     {/* Wrapping all navigators and screens */}
//                     <Stack.Navigator initialRouteName="Home">
//                         <Stack.Screen name="Layout" component={Layout} />
//                         <Stack.Screen name="Home" component={IndexPage} />
//                         <Stack.Screen name="About" component={AboutPage} />
//                         <Stack.Screen name="Team" component={TeamReports} />
//                         <Stack.Screen name="Documentation" component={Documentation} />
//                         <Stack.Screen name="Calendar" component={Calendar} />
//                         <Stack.Screen name="Gallery" component={Gallery} />
//                         {/* Route Restriction for Converter */}
//                         {/* <Stack.Screen name="Converter">
//                             {() => <App />}
//                         </Stack.Screen> */}
//                     </Stack.Navigator>
//                 </NavigationContainer>
//             </SafeAreaProvider>
//         </UserProvider>
//     );
// }