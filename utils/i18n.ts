import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { Storage } from "expo-sqlite/kv-store";

import de from "@/locales/de";
import ar from "@/locales/ar";
import en from "@/locales/en";

const languageDetector = {
  type: "languageDetector" as const,
  async: false as const, // synchronous detector

  // Return the detected language code synchronously
  detect: (): string => {
    try {
      const stored = Storage.getItemSync("language");
      if (stored) {
        return stored;
      }
    } catch (e) {
      console.warn("SQLite-KV getItemSync failed:", e);
    }
    // Fallback to device locale if nothing in storage
    const [{ languageTag }] = Localization.getLocales();
    return languageTag.split("-")[0];
  },

  init: (): void => {
    // no initialization required
  },

  // Persist the chosen language synchronously
  cacheUserLanguage: (lng: string): void => {
    try {
      Storage.setItemSync("language", lng);
    } catch (e) {
      console.warn("SQLite-KV setItemSync failed:", e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: "de",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
