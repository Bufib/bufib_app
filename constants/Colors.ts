const tintColorLight = "#2ea853";
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

    // Switch
    trackColor: "#767577",
    thumbColor: "#f4f3f4",

    // Prayer viewer colors
    prayerHeaderBackground: "#1F6E8C",
    prayerArabicText: "#0D4D6C",
    prayerTransliterationText: "#525252",
    prayerButtonBackground: "rgba(31, 110, 140, 0.15)",
    prayerButtonBackgroundActive: "#1F6E8C",
    prayerButtonText: "#1F6E8C",
    prayerButtonTextActive: "#FFFFFF",
    prayerIntroductionBackground: "#84CEEB",
    prayerLoadingIndicator: "#1F6E8C",
    prayerBookmark: "#B3D7EC",
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

    // Switch
    trackColor: "#057958",
    thumbColor: "#f4f3f4",

    // Prayer viewer colors
    prayerHeaderBackground: "#0F5A78",
    prayerArabicText: "#64B5F6",
    prayerTransliterationText: "#B0BEC5",
    prayerTranslationText: "#E2F0F9",
    prayerButtonBackground: "rgba(31, 110, 140, 0.3)",
    prayerButtonBackgroundActive: "#1F6E8C",
    prayerButtonText: "#84CEEB",
    prayerButtonTextActive: "#E2F0F9",
    prayerIntroductionBackground: "#1D3E53",
    prayerLoadingIndicator: "#84CEEB",
    prayerBookmark: "#4B7E94",
    grayedOut: "#B0BEC5",
  },
  universal: {
    primary: "#2ea853",
    secondary: "#1D3E53",
    grayedOut: "#888",
    link: "#0a84ff",
    questionLinks: "#2ea853",
    prayerLinks: "#84CEEB",
    externalLinkIcon: "#057958",
  },
};
