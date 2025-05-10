const tintColorLight = "#93C024";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    // Navigation
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // TabView
    indicatorColor: "#000",
    inactiveLabelColor: "#000",
    activeLabelColor: "#555",

    // General
    text: "#11181C",
    background: "#f2f2f2",
    contrast: "#fff",
    border: "#000",
    shadow: "#000",
    loadingIndicator: "#000",
    error: "#d32f2f",
  },

  dark: {
    // Navigation
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // TabView
    indicatorColor: "#fff",
    inactiveLabelColor: "#fff",
    activeLabelColor: "#aaa",

    // General
    text: "#ECEDEE",
    background: "#242c40",
    contrast: "#34495e",
    border: "#fff",
    shadow: "#fff",
    loadingIndicator: "#fff",
    error: "#f44336",
  },
  universal: {
    primary: "#93C024",
    secondary: "#1D3E53",
    grayedOut: "#888",
  },
};
