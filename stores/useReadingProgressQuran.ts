// stores/useReadingProgressQuran.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LanguageCode } from "@/constants/Types";

type SuraProgress = {
  lastVerseNumber: number; // 1-based
  lastIndex: number; // 0-based (FlashList index)
  totalVerses: number; // ayat count
  language: LanguageCode;
  timestamp: number;
};

type State = {
  progressBySura: Record<number, SuraProgress | undefined>;

  setTotalVerses: (suraNumber: number, total: number) => void;
  updateBookmark: (
    suraNumber: number,
    verseNumber: number,
    index: number,
    language: LanguageCode
  ) => void;
  clearSura: (suraNumber: number) => void;
  clearAll: () => void;
};

export const useReadingProgressQuran = create<State>()(
  persist(
    (set, get) => ({
      progressBySura: {},

      setTotalVerses: (suraNumber, total) => {
        const prev = get().progressBySura[suraNumber];
        set({
          progressBySura: {
            ...get().progressBySura,
            [suraNumber]: {
              lastVerseNumber: prev?.lastVerseNumber ?? 0,
              lastIndex: prev?.lastIndex ?? -1,
              totalVerses: total,
              language: (prev?.language ?? "de") as LanguageCode,
              timestamp: prev?.timestamp ?? Date.now(),
            },
          },
        });
      },

      updateBookmark: (suraNumber, verseNumber, index, language) => {
        const prev = get().progressBySura[suraNumber];
        set({
          progressBySura: {
            ...get().progressBySura,
            [suraNumber]: {
              lastVerseNumber: verseNumber,
              lastIndex: index,
              totalVerses: prev?.totalVerses ?? 0,
              language,
              timestamp: Date.now(),
            },
          },
        });
      },

      clearSura: (suraNumber) => {
        const map = { ...get().progressBySura };
        delete map[suraNumber];
        set({ progressBySura: map });
      },

      clearAll: () => set({ progressBySura: {} }),
    }),
    {
      name: "reading-progress-quran",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Note: no 'partialize' here to avoid TS mismatch across zustand versions.
    }
  )
);

// --- selectors ---

/** 0–100 % rounded */
export function useSuraPercent(suraNumber: number) {
  return useReadingProgressQuran((s) => {
    const p = s.progressBySura[suraNumber];
    if (!p || !p.totalVerses) return 0;
    return Math.max(
      0,
      Math.min(100, Math.round((p.lastVerseNumber / p.totalVerses) * 100))
    );
  });
}

/** Full progress for a sūrah (or undefined) */
export function useSuraProgress(suraNumber: number) {
  return useReadingProgressQuran((s) => s.progressBySura[suraNumber]);
}
