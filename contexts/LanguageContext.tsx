//! Works
// import { LanguageContextType } from "@/constants/Types";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { useTranslation } from "react-i18next";

// const LanguageContext = createContext<LanguageContextType>({
//   language: null,
//   setAppLanguage: async () => {},
//   ready: false,
//   isArabic: () => false,
// });

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const { i18n, ready: i18nReady } = useTranslation();
//   const [appLanguage, setAppLanguage] = useState<string | null>(null);
//   const [checkedStorage, setCheckedStorage] = useState(false);

//   // on mount, read saved language (if any)
//   useEffect(() => {
//     AsyncStorage.getItem("language")
//       .then((stored) => {
//         if (stored) {
//           i18n.changeLanguage(stored);
//           setAppLanguage(stored);
//         } else {
//           // no saved choice → stay null so LanguageSelection shows
//           setAppLanguage(null);
//         }
//       })
//       .finally(() => setCheckedStorage(true));
//   }, [i18n]);

//   // helper to set & persist a new language
//   const setAppLanguageFn = async (lng: string) => {
//     await AsyncStorage.setItem("language", lng);
//     await i18n.changeLanguage(lng);
//     setAppLanguage(lng);
//   };

//   const isArabic = () => appLanguage === "ar";

//   return (
//     <LanguageContext.Provider
//       value={{
//         language: appLanguage,
//         setAppLanguage: setAppLanguageFn,
//         isArabic,
//         ready: i18nReady && checkedStorage,
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   return useContext(LanguageContext);
// }
import { LanguageContextType, LanguageCode } from "@/constants/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";

const DEFAULT_LANG: LanguageCode = "de";

const LanguageContext = createContext<LanguageContextType>({
  lang: DEFAULT_LANG,
  setAppLanguage: async () => {},
  ready: false,
  rtl: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n, ready: i18nReady } = useTranslation();
  const [lang, setLang] = useState<LanguageCode>(DEFAULT_LANG);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // keep key "language" to preserve existing users
        const stored = (await AsyncStorage.getItem(
          "language"
        )) as LanguageCode | null;
        const next = stored ?? DEFAULT_LANG;
        await i18n.changeLanguage(next);
        if (mounted) setLang(next);
      } catch (e) {
        if (mounted) setLang(DEFAULT_LANG);
        console.warn("Language init failed:", e);
      } finally {
        if (mounted) setCheckedStorage(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [i18n]);

  useEffect(() => {
    const onChange = (lng: string) => setLang(lng as LanguageCode);
    i18n.on("languageChanged", onChange);
    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, [i18n]);

  const setAppLanguage = useCallback(
    async (lng: LanguageCode) => {
      try {
        await i18n.changeLanguage(lng);
        await AsyncStorage.setItem("language", lng);
        setLang(lng);
      } catch (e) {
        console.warn("Failed to change language:", e);
      }
    },
    [i18n]
  );

  const ready = i18nReady && checkedStorage;
  const rtl = lang === "ar";

  const value = useMemo(
    () => ({ lang, setAppLanguage, ready, rtl }),
    [lang, setAppLanguage, ready, rtl]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
