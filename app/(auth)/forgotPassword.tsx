import { StyleSheet, View } from "react-native";
import React from "react";
import { ForgotPassword } from "@/components/ForgotPassword";
const resetPassword = () => {
  return (
    <View style={styles.container}>
      <ForgotPassword />
    </View>
  );
};

export default resetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
