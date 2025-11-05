// //! Last that worked
// // hooks/useQuranAudio.ts
// import { useCallback, useEffect, useRef, useState } from "react";
// import { globalPlayer, useGlobalPlayer } from "@/player/useGlobalPlayer";
// import { QuranVerseType } from "@/constants/Types";

// export type AudioMetaOptions = {
//   /** e.g., "Al-Fātiḥa • 1:7" or "Juz 1 • 2:255" */
//   getTitleFor?: (v: QuranVerseType) => string;
//   /** Optional cover image */
//   artworkUri?: string;
// };

// const z3 = (n: number) => String(n).padStart(3, "0");

// function buildUrls(v: QuranVerseType): string[] {
//   const s = z3(v.sura);
//   const a = z3(v.aya);
//   const primary = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
//   const fallback = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.sura}/${v.aya}.mp3`;
//   return [primary, fallback];
// }

// function uriMatchesVerse(
//   uri: string | null | undefined,
//   v: QuranVerseType
// ): boolean {
//   if (!uri) return false;
//   const s = z3(v.sura);
//   const a = z3(v.aya);
//   return (
//     uri.endsWith(`/${s}${a}.mp3`) ||
//     uri.includes(`/${s}${a}.mp3?`) ||
//     uri.endsWith(`/${v.sura}/${v.aya}.mp3`) ||
//     uri.includes(`/${v.sura}/${v.aya}.mp3?`)
//   );
// }

// async function tryReplaceAny(urls: string[]): Promise<string> {
//   let lastErr: unknown;
//   for (const uri of urls) {
//     try {
//       await globalPlayer.replaceAsync({ uri });
//       return uri;
//     } catch (e) {
//       lastErr = e;
//     }
//   }
//   throw lastErr;
// }

// export function useQuranAudio(
//   verses: QuranVerseType[],
//   opts: AudioMetaOptions = {}
// ) {
//   // global store wires
//   const currentUri = useGlobalPlayer((s) => s.currentUri);
//   const isPlaying = useGlobalPlayer((s) => s.isPlaying);
//   const toggle = useGlobalPlayer((s) => s.toggle);
//   const stopRaw = useGlobalPlayer((s) => s.stopAndKeepSource);

//   // local
//   const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
//   const idxRef = useRef(-1);
//   const requestIdRef = useRef(0);

//   const makeTitle = useCallback(
//     (v: QuranVerseType) => opts.getTitleFor?.(v) ?? `Ayah ${v.sura}:${v.aya}`,
//     [opts]
//   );

//   const setMetaFor = useCallback(
//     (v: QuranVerseType) => {
//       useGlobalPlayer.setState({
//         title: makeTitle(v),
//         artwork: opts.artworkUri,
//         currentKey: `quran:${v.sura}:${v.aya}`,
//         stoppedByUser: false, // ensure MiniPlayer shows
//       });
//     },
//     [makeTitle, opts.artworkUri]
//   );

//   const isVersePlaying = useCallback(
//     (v: QuranVerseType) => uriMatchesVerse(currentUri, v) && isPlaying,
//     [currentUri, isPlaying]
//   );

//   const playByIndex = useCallback(
//     async (index: number) => {
//       if (index < 0 || index >= verses.length) return;
//       const verse = verses[index];
//       const myId = ++requestIdRef.current;
//       const urls = buildUrls(verse);

//       try {
//         const used = await tryReplaceAny(urls);
//         if (myId !== requestIdRef.current) return;

//         await globalPlayer.play();
//         if (myId !== requestIdRef.current) return;

//         setCurrentVerseIndex(index);
//         idxRef.current = index;
//         setMetaFor(verse);

//         if (__DEV__)
//           console.log("🎵 Playing", verse.sura, ":", verse.aya, "→", used);
//       } catch (err) {
//         if (myId !== requestIdRef.current) return;
//         console.error("❌ Audio load failed", err);
//       }
//     },
//     [verses, setMetaFor]
//   );

//   const playVerse = useCallback(
//     async (_v: QuranVerseType, i: number) => playByIndex(i),
//     [playByIndex]
//   );

//   const toggleVerse = useCallback(
//     async (v: QuranVerseType, i: number) => {
//       if (uriMatchesVerse(currentUri, v)) {
//         toggle();
//       } else {
//         await playByIndex(i);
//       }
//     },
//     [currentUri, toggle, playByIndex]
//   );

//   const playNext = useCallback(async () => {
//     const next = idxRef.current + 1;
//     if (next < verses.length) await playByIndex(next);
//   }, [playByIndex, verses.length]);

//   const playPrevious = useCallback(async () => {
//     const prev = idxRef.current - 1;
//     if (prev >= 0) await playByIndex(prev);
//   }, [playByIndex]);

//   /**
//    * Register global next/prev so the root GlobalAutoAdvance can drive the queue
//    * even if SuraScreen unmounts. We intentionally DO NOT unregister on unmount.
//    * They are cleared when the user presses Stop or when a new session overwrites them.
//    */
//   useEffect(() => {
//     useGlobalPlayer.setState({
//       _quranNext: playNext,
//       _quranPrev: playPrevious,
//     } as any);
//   }, [playNext, playPrevious]);

//   // Optional: when the verses array identity changes
//   useEffect(() => {
//     if (idxRef.current >= verses.length) {
//       idxRef.current = -1;
//       setCurrentVerseIndex(-1);
//     }
//   }, [verses.length]);

//   // Stop that also clears global advancers so auto-advance ends cleanly
//   const stop = useCallback(() => {
//     stopRaw();
//     useGlobalPlayer.setState({
//       _quranNext: undefined,
//       _quranPrev: undefined,
//     } as any);
//     useGlobalPlayer.setState({ stoppedByUser: true });
//   }, [stopRaw]);

//   return {
//     playVerse,
//     toggleVerse,
//     isVersePlaying,
//     playNext,
//     playPrevious,
//     currentVerseIndex,
//     stop,
//   };
// }

// hooks/useQuranAudio.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { globalPlayer, useGlobalPlayer } from "@/player/useGlobalPlayer";
import { QuranVerseType } from "@/constants/Types";

/** Supported reciters (safe defaults; add more later) */
export type ReciterId = "alafasy" | "minshawi" | "husary";

type ReciterMeta = {
  /** Folder on everyayah.com (primary) */
  everyayahBase?: string;
  /** Slug on cdn.islamic.network (fallback) */
  islamicSlug?: string;
  /** Pretty label for UI */
  label: string;
};

export const RECITERS: Record<ReciterId, ReciterMeta> = {
  alafasy:  { everyayahBase: "Alafasy_128kbps",           islamicSlug: "ar.alafasy", label: "Mishary Alafasy" },
  minshawi: { everyayahBase: "Minshawy_Murattal_128kbps", islamicSlug: "ar.minshawi", label: "Mohamed Minshawi" },
  husary:   { everyayahBase: "Husary_128kbps",            islamicSlug: "ar.husary",  label: "Mahmoud Al-Husary" },
};

export type AudioMetaOptions = {
  /** e.g., "Al-Fātiḥa • 1:7" */
  getTitleFor?: (v: QuranVerseType) => string;
  /** Optional cover image */
  artworkUri?: string;
  /** Selected reciter (default: alafasy) */
  reciter?: ReciterId;
};

const z3 = (n: number) => String(n).padStart(3, "0");

function buildUrls(v: QuranVerseType, reciter: ReciterId): string[] {
  const s = z3(v.sura);
  const a = z3(v.aya);
  const meta = RECITERS[reciter] ?? RECITERS.alafasy;

  const urls: string[] = [];

  if (meta.everyayahBase) {
    urls.push(`https://everyayah.com/data/${meta.everyayahBase}/${s}${a}.mp3`);
  }
  if (meta.islamicSlug) {
    urls.push(`https://cdn.islamic.network/quran/audio/128/${meta.islamicSlug}/${v.sura}/${v.aya}.mp3`);
  }

  // last-resort fallback: Alafasy on islamic.network (very reliable)
  if (urls.length === 0) {
    urls.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.sura}/${v.aya}.mp3`);
  }
  return urls;
}

function uriMatchesVerse(uri: string | null | undefined, v: QuranVerseType): boolean {
  if (!uri) return false;
  const s = z3(v.sura);
  const a = z3(v.aya);
  return (
    uri.endsWith(`/${s}${a}.mp3`) ||
    uri.includes(`/${s}${a}.mp3?`) ||
    uri.endsWith(`/${v.sura}/${v.aya}.mp3`) ||
    uri.includes(`/${v.sura}/${v.aya}.mp3?`)
  );
}

async function tryReplaceAny(urls: string[]): Promise<string> {
  let lastErr: unknown;
  for (const uri of urls) {
    try {
      await globalPlayer.replaceAsync({ uri });
      return uri;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export function useQuranAudio(verses: QuranVerseType[], opts: AudioMetaOptions = {}) {
  const reciter: ReciterId = opts.reciter ?? "alafasy";

  // global store bindings
  const currentUri = useGlobalPlayer((s) => s.currentUri);
  const isPlaying  = useGlobalPlayer((s) => s.isPlaying);
  const toggle     = useGlobalPlayer((s) => s.toggle);
  const stopRaw    = useGlobalPlayer((s) => s.stopAndKeepSource);

  // local
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const idxRef = useRef(-1);
  const requestIdRef = useRef(0);
  const lastReciterRef = useRef<ReciterId>(reciter);

  const makeTitle = useCallback(
    (v: QuranVerseType) => opts.getTitleFor?.(v) ?? `Ayah ${v.sura}:${v.aya}`,
    [opts]
  );

  const setMetaFor = useCallback(
    (v: QuranVerseType) => {
      useGlobalPlayer.setState({
        title: makeTitle(v),
        artwork: opts.artworkUri,
        currentKey: `quran:${v.sura}:${v.aya}:${reciter}`,
        stoppedByUser: false,
      });
    },
    [makeTitle, opts.artworkUri, reciter]
  );

  const isVersePlaying = useCallback(
    (v: QuranVerseType) => uriMatchesVerse(currentUri, v) && isPlaying,
    [currentUri, isPlaying]
  );

  const playByIndex = useCallback(
    async (index: number) => {
      if (index < 0 || index >= verses.length) return;
      const verse = verses[index];
      const myId = ++requestIdRef.current;

      try {
        const used = await tryReplaceAny(buildUrls(verse, reciter));
        if (myId !== requestIdRef.current) return;

        await globalPlayer.play();
        if (myId !== requestIdRef.current) return;

        setCurrentVerseIndex(index);
        idxRef.current = index;
        setMetaFor(verse);
        lastReciterRef.current = reciter;

        if (__DEV__) console.log("🎵 Playing", verse.sura, ":", verse.aya, "→", used, "▪", reciter);
      } catch (err) {
        if (myId !== requestIdRef.current) return;
        console.error("❌ Audio load failed", err);
      }
    },
    [verses, reciter, setMetaFor]
  );

  const playVerse = useCallback(async (_v: QuranVerseType, i: number) => playByIndex(i), [playByIndex]);

  const toggleVerse = useCallback(
    async (v: QuranVerseType, i: number) => {
      const sameVerse = uriMatchesVerse(currentUri, v);
      const reciterChanged = lastReciterRef.current !== reciter;
      if (sameVerse && !reciterChanged) {
        toggle();
      } else {
        await playByIndex(i);
      }
    },
    [currentUri, reciter, toggle, playByIndex]
  );

  const playNext = useCallback(async () => {
    const next = idxRef.current + 1;
    if (next < verses.length) await playByIndex(next);
  }, [playByIndex, verses.length]);

  const playPrevious = useCallback(async () => {
    const prev = idxRef.current - 1;
    if (prev >= 0) await playByIndex(prev);
  }, [playByIndex]);

  // keep auto-advance global
  useEffect(() => {
    useGlobalPlayer.setState({ _quranNext: playNext, _quranPrev: playPrevious } as any);
  }, [playNext, playPrevious]);

  useEffect(() => {
    if (idxRef.current >= verses.length) {
      idxRef.current = -1;
      setCurrentVerseIndex(-1);
    }
  }, [verses.length]);

  const stop = useCallback(() => {
    stopRaw();
    useGlobalPlayer.setState({ _quranNext: undefined, _quranPrev: undefined } as any);
    useGlobalPlayer.setState({ stoppedByUser: true });
  }, [stopRaw]);

  return {
    playVerse,
    toggleVerse,
    isVersePlaying,
    playNext,
    playPrevious,
    currentVerseIndex,
    stop,
  };
}
