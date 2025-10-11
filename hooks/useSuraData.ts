// hooks/useSuraData.ts

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  LanguageCode,
  QuranVerseType,
  SuraRowType,
  UseSuraDataParams,
} from "@/constants/Types";
import {
  getSurahVerses,
  getSurahDisplayName,
  getSurahInfoByNumber,
  getJuzVerses,
  getJuzBounds,
  getPageVerses,
  getPageBounds,
} from "@/db/queries/quran";
import { whenDatabaseReady } from "@/db";
import { seedJuzIndex, seedPageIndex } from "@/utils/quranIndex";
import {
  loadBookmarkedVerses,
  preseedPagesForSurah,
  preseedJuzCoverageForSurah,
} from "@/stores/suraStore";

export function useSuraData({
  lang,
  suraNumber,
  isJuzMode,
  juzNumber,
  isPageMode,
  pageNumber,
  setTotalVerses,
  setTotalVersesForJuz,
  setTotalVersesForPage,
}: UseSuraDataParams) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<QuranVerseType[]>([]);
  const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
  const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [juzHeader, setJuzHeader] = useState<{
    title: string;
    subtitle?: string;
  } | null>(null);
  const [bookmarksBySura, setBookmarksBySura] = useState<
    Map<number, Set<number>>
  >(new Map());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        await whenDatabaseReady();

        if (isJuzMode && juzNumber) {
          // --- JUZ MODE ---
          const [vers, arabicVers] = await Promise.all([
            getJuzVerses(lang, juzNumber),
            getJuzVerses("ar", juzNumber),
          ]);
          setTotalVersesForJuz(juzNumber, vers.length);
          seedJuzIndex(juzNumber, vers);

          const bounds = await getJuzBounds(juzNumber);
          if (bounds) {
            const startName =
              (await getSurahDisplayName(bounds.startSura, lang)) ??
              `Sura ${bounds.startSura}`;
            setJuzHeader({
              title: `${t("juz") ?? "Juz"} ${juzNumber}`,
              subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
                bounds.startAya
              }`,
            });
          } else {
            setJuzHeader({ title: `${t("juz") ?? "Juz"} ${juzNumber}` });
          }

          const distinctSuras = Array.from(new Set(vers.map((v) => v.sura)));
          const map = new Map<number, Set<number>>();
          for (const s of distinctSuras) {
            map.set(s, await loadBookmarkedVerses(s));
          }

          if (!cancelled) {
            setVerses(vers ?? []);
            setArabicVerses(arabicVers ?? []);
            setSuraInfo(null);
            setDisplayName("");
            setBookmarksBySura(map);
          }
        } else if (isPageMode && pageNumber) {
          // --- PAGE MODE ---
          const [vers, arabicVers] = await Promise.all([
            getPageVerses(lang, pageNumber),
            getPageVerses("ar", pageNumber),
          ]);
          setTotalVersesForPage(pageNumber, vers.length);
          seedPageIndex(pageNumber, vers);

          const bounds = await getPageBounds(pageNumber);
          if (bounds) {
            const startName =
              (await getSurahDisplayName(bounds.startSura, lang)) ??
              `Sura ${bounds.startSura}`;
            setJuzHeader({
              title: `${t("page") ?? "Page"} ${pageNumber}`,
              subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
                bounds.startAya
              }`,
            });
          } else {
            setJuzHeader({ title: `${t("page") ?? "Page"} ${pageNumber}` });
          }

          const distinctSuras = Array.from(
            new Set((vers ?? []).map((v) => v.sura))
          );
          const map = new Map<number, Set<number>>();
          for (const s of distinctSuras) {
            map.set(s, await loadBookmarkedVerses(s));
          }

          if (!cancelled) {
            setVerses((vers ?? []) as QuranVerseType[]);
            setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
            setSuraInfo(null);
            setDisplayName("");
            setBookmarksBySura(map);
          }
        } else {
          // --- SURAH MODE ---
          const [vers, arabicVers, info, name] = await Promise.all([
            getSurahVerses(lang, suraNumber),
            getSurahVerses("ar", suraNumber),
            getSurahInfoByNumber(suraNumber),
            getSurahDisplayName(suraNumber, lang),
          ]);
          const totalVerses = info?.nbAyat ?? vers?.length ?? 0;

          setTotalVerses(suraNumber, totalVerses);

          try {
            await preseedPagesForSurah(info!);
          } catch {}

          preseedJuzCoverageForSurah(suraNumber);

          const map = new Map<number, Set<number>>();
          map.set(suraNumber, await loadBookmarkedVerses(suraNumber));

          if (!cancelled) {
            setVerses((vers ?? []) as QuranVerseType[]);
            setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
            setSuraInfo(info ?? null);
            setDisplayName(name ?? "");
            setJuzHeader(null);
            setBookmarksBySura(map);
          }
        }
      } catch (error) {
        console.error("Failed to load verses:", error);
        if (!cancelled) {
          setVerses([]);
          setArabicVerses([]);
          setSuraInfo(null);
          setDisplayName("");
          setJuzHeader(null);
          setBookmarksBySura(new Map());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    lang,
    suraNumber,
    isJuzMode,
    juzNumber,
    isPageMode,
    pageNumber,
    setTotalVerses,
    setTotalVersesForJuz,
    setTotalVersesForPage,
    t,
  ]);

  return {
    loading,
    verses,
    arabicVerses,
    suraInfo,
    displayName,
    juzHeader,
    bookmarksBySura,
    setBookmarksBySura,
  };
}
