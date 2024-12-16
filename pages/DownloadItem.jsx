// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system';

// function DownloadItem({ fileType, filePath, fileName, description }) {
//     // function responsible for handlind downloads with a expo-file-system
//     const handleDownload = async () => {
//         try {
//             if(filePath.startsWith('http')) {
//                 await Linking.openURL(filePath);
//             } else {
//                 const downloadUri = `${FileSystem.documentDirectory}${fileName}`;
//                 const { uri } = await FileSystem.downloadAsync(filePath, downloadUri);
//                 Alert.alert('Download complete', `File saved to ${uri}`);
//             }
//         } catch(error) {
//             Alert.alert('Download failed', error.message);
//         }
//     };

//     return (
//         <View style={StyleSheet.memberContainer}>
//             <TouchableOpacity onPress={handleDownload}>
//                 <Image
//                     // TODO:
//                     source={{ uri: `todo/images/${fileType}.png`}}
//                     style={styles.image}
//                 />
//             </TouchableOpacity>
//             <Text style={styles.description}>
//                 {description}
//             </Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     memberContainer: {
//         alignItems: 'center',
//         padding: 16,
//         margin: 10,
//         borderRadius: 10,
//         backgroundColor: '#f5f5f5',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     image: {
//         height: 50,
//         width: 50,
//         marginBottom: 10,
//     },
//     description: {
//         fontSize: 14,
//         textAlign: 'center',
//         marginVertical: 5,
//     },
// });

// export default DownloadItem;