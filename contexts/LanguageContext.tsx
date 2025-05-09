import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { LanguageContextType } from "@/constants/Types";

const LanguageContext = createContext<LanguageContextType>({
  language: null,
  setAppLanguage: async () => {},
  ready: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n, ready: i18nReady } = useTranslation();
  const [language, setLanguage] = useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  // load saved language (or default from detector) once
  useEffect(() => {
    AsyncStorage.getItem("language")
      .then((stored) => {
        if (stored) {
          i18n.changeLanguage(stored);
          setLanguage(stored);
        }
      })
      .finally(() => setCheckedStorage(true));
  }, []);

  // helper to change language both in i18n and storage
  const setAppLanguage = async (lng: string) => {
    await AsyncStorage.setItem("language", lng);
    await i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setAppLanguage,
        ready: i18nReady && checkedStorage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
