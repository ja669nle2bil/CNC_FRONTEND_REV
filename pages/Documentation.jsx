// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import DownloadItem from './DownloadItem';

// function Documentation() {
//     const downloadItems = [
//         { fileType: 'cpp', filePath: 'https://example.com/functions/czyszczenie.cpp', fileName: 'Czyszczenie.cpp', description: 'Funkcja do wyrównywania powierzchni materiału' },
//         { fileType: 'pdf', filePath: 'https://example.com/functions/instrukcja.pdf', fileName: 'Instrukcja.pdf', description: 'Dokumentacja z instrukcją do tworzenia bloków żywicznych'},
//         { fileType: 'git', filePath: 'https://github.com/pz09-CORVUS-CORAX', fileName: '', description: 'Strona github projektu' },
//         { fileType: 'zip', filePath: 'https://example.com/functions/generator.zip', fileName: 'generator.zip', description: 'Dokumentacja generatora GCode' },
//         { fileType: 'zip', filePath: 'https://example.com/functions/API.zip', fileName: 'API.zip', description: 'Dokumentacja dla api serwisowego' },
//     ];

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Files for download</Text>
//             <View style={styles.row}>
//                 {downloadItems.map((item) => {
//                     <DownloadItem key={item.filePath} {...item} />
//                 })}
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     row: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-around',
//     },
// });

// export default Documentation;