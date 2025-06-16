import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'

const HeaderLeftBackButton = () => {
    const colorScheme = useColorScheme() || "light";
  return (
    <Ionicons
        name="chevron-back-outline"
        size={30}
        style={{ marginLeft: -16 }}
        onPress={() => router.back()}
        color={Colors.universal.link}
      /> 
  )
}

export default HeaderLeftBackButton

const styles = StyleSheet.create({})

