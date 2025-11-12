import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

const HeaderLeftBackButton = ({
  color,
  size,
  style,
}: {
  color?: string | null;
  size?: number | null;
  style?: any;
}) => {
  return (
    <Ionicons
      name="chevron-back-outline"
      size={size ? size : 30}
      style={style ? style : { marginLeft: -16 }}
      onPress={() => {
        router.back();
      }}
      color={color ? color : Colors.universal.link}
    />
  );
};

export default HeaderLeftBackButton;

