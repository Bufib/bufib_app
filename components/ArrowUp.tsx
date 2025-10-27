// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
// import { AntDesign } from "@expo/vector-icons";
// import { Colors } from "@/constants/Colors";

// const ArrowUp = ({ scrollToTop }: { scrollToTop: () => void }) => {
//   return (
//     <TouchableOpacity style={styles.arrowUp} onPress={scrollToTop}>
//       <AntDesign name="up" size={28} color="white" />
//     </TouchableOpacity>
//   );
// };

// export default ArrowUp;

// const styles = StyleSheet.create({
//   arrowUp: {
//     position: "absolute",
//     bottom: "20%",
//     right: "3%",
//     borderWidth: 2.5,
//     borderRadius: 99,
//     padding: 5,
//     backgroundColor: Colors.universal.primary,
//     borderColor: Colors.universal.primary,
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const ArrowUp = ({ scrollToTop }: { scrollToTop: () => void }) => {
  return (
    <TouchableOpacity
      style={styles.arrowUp}
      onPress={scrollToTop}
      activeOpacity={0.7}
      accessibilityLabel="Scroll to top"
      accessibilityRole="button"
    >
      <AntDesign name="up" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default ArrowUp;

const styles = StyleSheet.create({
  arrowUp: {
    position: "absolute",
    bottom: "15%",
    right: "5%",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.universal.primary,
    justifyContent: "center",
    alignItems: "center",

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,

    // Android Shadow
    elevation: 8,
  },
});
