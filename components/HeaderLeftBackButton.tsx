import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const HeaderLeftBackButton = () => {
    const colorScheme = useColorScheme() || "light";
  return (
    <Ionicons
        name="chevron-back-outline"
        size={30}
        style={{ marginLeft: -16 }}
        onPress={() => router.back()}
        color={colorScheme === "dark" ? "#d0d0c0" : "#000"}
      />
  )
}

export default HeaderLeftBackButton

const styles = StyleSheet.create({})

