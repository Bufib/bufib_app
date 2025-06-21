

// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import SuraList from '@/components/SuraList';
// import SuraDetail from '@/components/SuraDetails';
// import VerseText from '@/components/VerseText';
// import VerseExplanation from '@/components/VerseExplaination';
// import { suras } from '@/utils/suraData';

// const RenderCalender = () => {
//   const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'verses', 'explanation'
//   const [selectedSura, setSelectedSura] = useState(null);
//   const [selectedVerse, setSelectedVerse] = useState(null);

//   const handleSuraSelect = (sura) => {
//     setSelectedSura(sura);
//     setCurrentView('detail');
//   };

//   const handleShowVerses = () => {
//     setCurrentView('verses');
//   };

//   const handleVerseSelect = (verse) => {
//     setSelectedVerse(verse);
//     setCurrentView('explanation');
//   };

//   const handleBackToList = () => {
//     setCurrentView('list');
//     setSelectedSura(null);
//   };

//   const handleBackToDetail = () => {
//     setCurrentView('detail');
//     setSelectedVerse(null);
//   };

//   const handleBackToVerses = () => {
//     setCurrentView('verses');
//     setSelectedVerse(null);
//   };

//   const renderCurrentView = () => {
//     switch (currentView) {
//       case 'list':
//         return (
//           <SuraList
//             suras={suras}
//             onSuraSelect={handleSuraSelect}
//           />
//         );
//       case 'detail':
//         return (
//           <SuraDetail
//             sura={selectedSura}
//             onBack={handleBackToList}
//             onShowVerses={handleShowVerses}
//           />
//         );
//       case 'verses':
//         return (
//           <VerseText
//             sura={selectedSura}
//             onBack={handleBackToDetail}
//             onVerseSelect={handleVerseSelect}
//           />
//         );
//       case 'explanation':
//         return (
//           <VerseExplanation
//             sura={selectedSura}
//             verse={selectedVerse}
//             onBack={handleBackToVerses}
//           />
//         );
//       default:
//         return (
//           <SuraList
//             suras={suras}
//             onSuraSelect={handleSuraSelect}
//           />
//         );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#065f46" />
//       {renderCurrentView()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0fdf4',
//   },
// });

// export default RenderCalender;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const indexQuran = () => {
  return (
    <View>
      <Text>indexQuran</Text>
    </View>
  )
}

export default indexQuran

const styles = StyleSheet.create({})