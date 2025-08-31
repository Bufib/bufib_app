import { LanguageContextType } from "@/constants/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext<LanguageContextType>({
  language: null,
  setAppLanguage: async () => {},
  ready: false,
  isArabic: () => false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n, ready: i18nReady } = useTranslation();
  const { language: detectedLang } = useLanguage();
  const [appLanguage, setAppLanguage] = useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  // on mount, read saved language (if any)
  useEffect(() => {
    AsyncStorage.getItem("language")
      .then((stored) => {
        if (stored) {
          i18n.changeLanguage(stored);
          setAppLanguage(stored);
        } else {
          // no saved choice → stay null so LanguageSelection shows
          setAppLanguage(null);
        }
      })
      .finally(() => setCheckedStorage(true));
  }, [i18n]);

  // helper to set & persist a new language
  const setAppLanguageFn = async (lng: string) => {
    await AsyncStorage.setItem("language", lng);
    await i18n.changeLanguage(lng);
    setAppLanguage(lng);
  };

  const isArabic = () => appLanguage === "ar";

  return (
    <LanguageContext.Provider
      value={{
        language: appLanguage,
        setAppLanguage: setAppLanguageFn,
        isArabic,
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
