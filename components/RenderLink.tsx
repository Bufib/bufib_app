// import { ThemedText } from "@/components/ThemedText";
// import { Colors } from "@/constants/Colors";
// import { useLanguage } from "@/contexts/LanguageContext";
// import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
// import Feather from "@expo/vector-icons/Feather";
// import React from "react";
// import { Pressable, StyleSheet, useColorScheme } from "react-native";
// import handleOpenInternallUrl from "../utils/handleOpenInternalUrl";

// type RenderLinkPropsType = {
//   url: string;
//   index: number;
//   isExternal: boolean;
// };

// const RenderLink = ({
//   url,
//   index,
//   isExternal,
// }: RenderLinkPropsType) => {
//   const colorScheme = useColorScheme();
//   const { rtl } = useLanguage();
//   const { lang } = useLanguage();
//   return (
//     <Pressable
//       key={index}
//       style={({ pressed }) => [
//         styles.linkButton,
//         pressed && styles.linkButtonPressed,
//       ]}
//       onPress={() =>
//         isExternal
//           ? handleOpenExternalUrl(url)
//           : handleOpenInternallUrl(url, lang, "questionLink")
//       }
//     >
//       <Feather
//         name={isExternal ? "external-link" : "link"}
//         size={14}
//         color={colorScheme === "dark" ? "#fff" : "#000"}
//         style={{ paddingRight: 5 }}
//       />
//       <ThemedText
//         style={[styles.linkText, { textAlign: rtl ? "right" : "left" }]}
//         numberOfLines={1}
//         ellipsizeMode="tail"
//       >
//         {url}
//       </ThemedText>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   linkButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 6,
//   },
//   linkButtonPressed: {
//     opacity: 0.5,
//   },
//   linkText: {
//     fontSize: 14,
//     color: Colors.universal.link,
//     flexShrink: 1,
//   },
// });

// export default RenderLink;

// RenderLink.tsx
// RenderLink.tsx
// RenderLink.tsx

import React, { useEffect, useState, useCallback } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";

import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import handleOpenInternallUrl from "@/utils/handleOpenInternalUrl";

import { getQuestionInternalURL } from "@/db/queries/questions";
import { getPrayerInternalURL } from "@/db/queries/prayers";
import { getQuranInternalURL } from "@/db/queries/quran";

type InternalLinkType = "questionLink" | "prayerLink" | "quranLink";

type RenderLinkProps = {
  url: string;
  index: number;
  isExternal: boolean;
};

type ParsedInternal =
  | { type: "questionLink"; identifier: number }
  | { type: "prayerLink"; identifier: number }
  | { type: "quranLink"; identifier: string } // "sura:aya"
  | null;

/** Canonical only:
 *  - questionLink:<number>
 *  - prayerLink:<number>
 *  - quranLink:<sura>:<aya>
 */
const parseInternalUrl = (raw: string): ParsedInternal => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const [maybeType, ...rest] = trimmed.split(":");
  const remainder = rest.join(":").trim();
  if (!remainder) return null;

  if (maybeType === "questionLink") {
    const id = Number(remainder);
    if (Number.isNaN(id)) return null;
    return { type: "questionLink", identifier: id };
  }

  if (maybeType === "prayerLink") {
    const id = Number(remainder);
    if (Number.isNaN(id)) return null;
    return { type: "prayerLink", identifier: id };
  }

  if (maybeType === "quranLink") {
    // Expect "sura:aya" as remainder; validation happens downstream
    return { type: "quranLink", identifier: remainder };
  }

  return null;
};

const getExternalLabel = (url: string): string => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    return host || url;
  } catch {
    return url;
  }
};

const buildQuranLabel = (identifier: string, q: any, lang: string): string => {
  const [suraStr] = identifier.split(":"); // we don't care about aya for label
  const sura = q?.sura ?? Number(suraStr);

  let suraName: string | undefined;

  if (lang === "ar") {
    suraName =
      q?.sura_label_ar ||
      q?.label_ar ||
      q?.label || // generic
      q?.sura_name_ar;
  } else {
    // de + en (and others): prefer English label, then DE, then generic
    suraName =
      q?.sura_label_en ||
      q?.label_en ||
      q?.sura_label_de ||
      q?.label_de ||
      q?.label;
  }

  if (suraName && Number.isFinite(sura)) {
    // ✅ "Al-Fatiha (1)"
    return `${suraName} (${sura})`;
  }

  if (suraName) {
    return suraName;
  }

  if (Number.isFinite(sura)) {
    return `Sura ${sura}`;
  }

  // Last fallback
  return identifier;
};

const RenderLink = ({ url, index, isExternal }: RenderLinkProps) => {
  const colorScheme = useColorScheme() || "light";
  const { rtl, lang } = useLanguage();

  const [label, setLabel] = useState<string>(
    isExternal ? getExternalLabel(url) : `Link ${index + 1}`
  );

  /* ---------------------------- on press ---------------------------- */

  const handlePress = useCallback(() => {
    if (isExternal) {
      handleOpenExternalUrl(url);
      return;
    }

    const parsed = parseInternalUrl(url);
    if (!parsed) return;

    const { type, identifier } = parsed;
    // handleOpenInternallUrl expects identifier as string
    handleOpenInternallUrl(String(identifier), lang, type);
  }, [url, isExternal, lang]);

  /* ---------------------- external label hydrate ---------------------- */

  useEffect(() => {
    if (isExternal) {
      setLabel(getExternalLabel(url));
    }
  }, [url, isExternal]);

  /* ---------------------- internal label hydrate ---------------------- */

  useEffect(() => {
    if (isExternal) return;

    const parsed = parseInternalUrl(url);
    if (!parsed) {
      // If malformed, show raw for debugging
      setLabel(url);
      return;
    }

    const { type, identifier } = parsed;
    let cancelled = false;

    const load = async () => {
      try {
        if (type === "questionLink") {
          const q = await getQuestionInternalURL(identifier, lang);
          if (!cancelled) {
            setLabel(q?.title || `Frage ${identifier}`);
          }
          return;
        }

        if (type === "prayerLink") {
          const p = await getPrayerInternalURL(identifier, lang);
          if (!cancelled) {
            setLabel(lang==="ar" &&p?.arabic_title || p?.name || `Gebet ${identifier}`);
          }
          return;
        }

        if (type === "quranLink") {
          // identifier = "sura:aya"
          const q = await getQuranInternalURL(identifier, lang);
          if (!cancelled) {
            if (q) {
              setLabel(buildQuranLabel(identifier, q, lang));
            } else {
              setLabel(buildQuranLabel(identifier, {}, lang));
            }
          }
          return;
        }
      } catch (error) {
        console.error("RenderLink: failed to hydrate label", error);
        if (!cancelled) {
          setLabel(`Link ${index + 1}`);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, lang, isExternal, index]);

  /* ------------------------------ render ------------------------------ */

  return (
    <Pressable
      style={({ pressed }) => [
        styles.linkButton,
        pressed && styles.linkButtonPressed,
      ]}
      onPress={handlePress}
    >
      <Feather
        name={isExternal ? "external-link" : "link"}
        size={14}
        color={colorScheme === "dark" ? "#fff" : "#000"}
        style={{ paddingRight: 5 }}
      />
      <ThemedText
        style={[styles.linkText, { textAlign: rtl ? "right" : "left" }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
  },
  linkButtonPressed: {
    opacity: 0.5,
  },
  linkText: {
    fontSize: 14,
    color: Colors.universal.link,
    flexShrink: 1,
  },
});

export default RenderLink;
