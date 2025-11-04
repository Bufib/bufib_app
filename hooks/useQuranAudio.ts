// // import { useCallback, useEffect, useRef, useState } from "react";
// // import { globalPlayer, useGlobalPlayer } from "@/player/useGlobalPlayer";
// // import { QuranVerseType } from "@/constants/Types";

// // /** Optional metadata for the mini-player */
// // export type AudioMetaOptions = {
// //   getTitleFor?: (v: QuranVerseType) => string; // e.g. "Al-Fātiḥa • 1:7"
// //   artworkUri?: string; // cover image if available
// // };

// // /** Zero-pad to 3 digits */
// // const z3 = (n: number) => String(n).padStart(3, "0");

// // /** Candidate URLs: primary first, then fallback(s) */
// // function buildUrls(v: QuranVerseType): string[] {
// //   const s = z3(v.sura);
// //   const a = z3(v.aya);

// //   // Primary (EveryAyah, Alafasy 128kbps)
// //   const primary = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;

// //   // Fallback (Islamic Network, Alafasy)
// //   const fallback = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.sura}/${v.aya}.mp3`;

// //   return [primary, fallback];
// // }

// // /** Heuristic: does uri point to this verse (primary or fallback patterns)? */
// // function uriMatchesVerse(
// //   uri: string | null | undefined,
// //   v: QuranVerseType
// // ): boolean {
// //   if (!uri) return false;
// //   const s = z3(v.sura);
// //   const a = z3(v.aya);
// //   return (
// //     uri.endsWith(`/${s}${a}.mp3`) ||
// //     uri.includes(`/${s}${a}.mp3?`) ||
// //     uri.endsWith(`/${v.sura}/${v.aya}.mp3`) ||
// //     uri.includes(`/${v.sura}/${v.aya}.mp3?`)
// //   );
// // }

// // /** Try URLs in order; resolve with first that loads */
// // async function tryReplaceAny(urls: string[]): Promise<string> {
// //   let lastErr: unknown;
// //   for (const uri of urls) {
// //     try {
// //       await globalPlayer.replaceAsync({ uri });
// //       return uri;
// //     } catch (e) {
// //       lastErr = e;
// //     }
// //   }
// //   throw lastErr;
// // }

// // export function useQuranAudio(
// //   verses: QuranVerseType[],
// //   opts: AudioMetaOptions = {}
// // ) {
// //   // ---- global player store bindings
// //   const currentUri = useGlobalPlayer((s) => s.currentUri);
// //   const isPlaying = useGlobalPlayer((s) => s.isPlaying);
// //   const position = useGlobalPlayer((s) => s.position); // set by GlobalVideoHost
// //   const duration = useGlobalPlayer((s) => s.duration); // set by GlobalVideoHost
// //   const toggle = useGlobalPlayer((s) => s.toggle);
// //   const stopAndKeepSource = useGlobalPlayer((s) => s.stopAndKeepSource);

// //   // ---- local state
// //   const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);

// //   // Race guard: only the latest request can win
// //   const requestIdRef = useRef(0);

// //   // Prevent duplicate auto-advance triggers at the end of a track
// //   const advanceLockRef = useRef(false);

// //   // Build & set mini-player metadata
// //   const makeTitle = useCallback(
// //     (v: QuranVerseType) => opts.getTitleFor?.(v) ?? `Ayah ${v.sura}:${v.aya}`,
// //     [opts]
// //   );

// //   const setMetaFor = useCallback(
// //     (v: QuranVerseType) => {
// //       useGlobalPlayer.setState({
// //         title: makeTitle(v),
// //         artwork: opts.artworkUri,
// //         currentKey: `quran:${v.sura}:${v.aya}`,
// //         stoppedByUser: false, // ensures MiniPlayerBar shows
// //       });
// //     },
// //     [makeTitle, opts.artworkUri]
// //   );

// //   // Is this verse currently playing?
// //   const isVersePlaying = useCallback(
// //     (verse: QuranVerseType) => uriMatchesVerse(currentUri, verse) && isPlaying,
// //     [currentUri, isPlaying]
// //   );

// //   // Core: play a verse with URL fallbacks + race guard
// //   const playVerse = useCallback(
// //     async (verse: QuranVerseType, index: number) => {
// //       const myId = ++requestIdRef.current;
// //       const urls = buildUrls(verse);

// //       try {
// //         const used = await tryReplaceAny(urls);
// //         if (myId !== requestIdRef.current) return; // stale

// //         await globalPlayer.play();
// //         if (myId !== requestIdRef.current) return; // stale

// //         setCurrentVerseIndex(index);
// //         setMetaFor(verse);
// //         advanceLockRef.current = false; // new track → reset end lock

// //         if (__DEV__) {
// //           // eslint-disable-next-line no-console
// //           console.log("🎵 Playing", verse.sura, ":", verse.aya, "→", used);
// //         }
// //       } catch (err) {
// //         if (myId !== requestIdRef.current) return; // stale
// //         // eslint-disable-next-line no-console
// //         console.error("❌ Audio load failed for", verse.sura, verse.aya, err);
// //       }
// //     },
// //     [setMetaFor]
// //   );

// //   // Toggle play/pause for a verse (load if different)
// //   const toggleVerse = useCallback(
// //     async (verse: QuranVerseType, index: number) => {
// //       if (uriMatchesVerse(currentUri, verse)) {
// //         toggle();
// //       } else {
// //         await playVerse(verse, index);
// //       }
// //     },
// //     [currentUri, toggle, playVerse]
// //   );

// //   // Next / Previous
// //   const playNext = useCallback(async () => {
// //     const nextIndex = currentVerseIndex + 1;
// //     if (nextIndex < verses.length) {
// //       await playVerse(verses[nextIndex], nextIndex);
// //     } else if (__DEV__) {
// //       // eslint-disable-next-line no-console
// //       console.log("🏁 End of verses");
// //     }
// //   }, [currentVerseIndex, verses, playVerse]);

// //   const playPrevious = useCallback(async () => {
// //     const prevIndex = currentVerseIndex - 1;
// //     if (prevIndex >= 0) {
// //       await playVerse(verses[prevIndex], prevIndex);
// //     } else if (__DEV__) {
// //       // eslint-disable-next-line no-console
// //       console.log("🏁 Start of verses");
// //     }
// //   }, [currentVerseIndex, verses, playVerse]);

// //   // -------- Auto-advance WITHOUT an "ended" event ----------
// //   // Strategy:
// //   // 1) If position is within 0.25s of duration while playing → advance once.
// //   // 2) Also catch the transition from playing → paused when near end.

// //   // 1) Near-end polling via store time
// //   useEffect(() => {
// //     if (!duration || duration <= 0) {
// //       advanceLockRef.current = false;
// //       return;
// //     }
// //     const nearEnd = (position ?? 0) >= duration - 0.25; // small epsilon
// //     if (isPlaying && nearEnd && !advanceLockRef.current) {
// //       advanceLockRef.current = true;
// //       void playNext();
// //     }
// //     // reset lock when clearly not near end (new track or seek)
// //     if (!nearEnd && (position ?? 0) < duration - 0.5) {
// //       advanceLockRef.current = false;
// //     }
// //   }, [position, duration, isPlaying, playNext]);

// //   // 2) Transition detector: playing → not playing near the end
// //   const prevPlayingRef = useRef(isPlaying);
// //   useEffect(() => {
// //     const prev = prevPlayingRef.current;
// //     if (prev && !isPlaying) {
// //       const nearEnd = !!duration && (position ?? 0) >= duration - 0.25;
// //       if (nearEnd && !advanceLockRef.current) {
// //         advanceLockRef.current = true;
// //         void playNext();
// //       }
// //     }
// //     prevPlayingRef.current = isPlaying;
// //   }, [isPlaying, position, duration, playNext]);

// //   // Reset index when verse list replaces (don’t stop playback to allow continuity)
// //   useEffect(() => {
// //     setCurrentVerseIndex(-1);
// //   }, [verses?.length]);

// //   // Reset end-lock on source change (new uri)
// //   useEffect(() => {
// //     advanceLockRef.current = false;
// //   }, [currentUri]);

// //   return {
// //     playVerse,
// //     toggleVerse,
// //     isVersePlaying,
// //     playNext,
// //     playPrevious,
// //     currentVerseIndex,
// //     stop: stopAndKeepSource,
// //   };
// // }

// // hooks/useQuranAudio.ts
// import { useCallback, useEffect, useRef, useState } from "react";
// import { globalPlayer, useGlobalPlayer } from "@/player/useGlobalPlayer";
// import { QuranVerseType } from "@/constants/Types";

// export type AudioMetaOptions = {
//   getTitleFor?: (v: QuranVerseType) => string;
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
//   const stop = useGlobalPlayer((s) => s.stopAndKeepSource);

//   // local
//   const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
//   const idxRef = useRef(-1);
//   const requestIdRef = useRef(0);

//   // build meta
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
//         stoppedByUser: false,
//       });
//     },
//     [makeTitle, opts.artworkUri]
//   );

//   const isVersePlaying = useCallback(
//     (v: QuranVerseType) => uriMatchesVerse(currentUri, v) && isPlaying,
//     [currentUri, isPlaying]
//   );

//   // direct play by index (used by next/prev & toggle)
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
//     async (v: QuranVerseType, i: number) => playByIndex(i),
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
//    * Register global next/prev callbacks so GlobalAutoAdvance can
//    * advance the queue even after this screen unmounts.
//    */
//   useEffect(() => {
//     const api = {
//       _quranNext: playNext,
//       _quranPrev: playPrevious,
//     };
//     useGlobalPlayer.setState(api as any);
//     return () => {
//       // only clear if we still own them (avoid clobbering a newer screen)
//       const s = useGlobalPlayer.getState() as any;
//       if (s._quranNext === playNext) s._quranNext = undefined;
//       if (s._quranPrev === playPrevious) s._quranPrev = undefined;
//     };
//   }, [playNext, playPrevious]);

//   // when verses list identity changes, keep current index only if within range
//   useEffect(() => {
//     if (idxRef.current >= verses.length) {
//       idxRef.current = -1;
//       setCurrentVerseIndex(-1);
//     }
//   }, [verses.length]);

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

export type AudioMetaOptions = {
  /** e.g., "Al-Fātiḥa • 1:7" or "Juz 1 • 2:255" */
  getTitleFor?: (v: QuranVerseType) => string;
  /** Optional cover image */
  artworkUri?: string;
};

const z3 = (n: number) => String(n).padStart(3, "0");

function buildUrls(v: QuranVerseType): string[] {
  const s = z3(v.sura);
  const a = z3(v.aya);
  const primary = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
  const fallback = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.sura}/${v.aya}.mp3`;
  return [primary, fallback];
}

function uriMatchesVerse(
  uri: string | null | undefined,
  v: QuranVerseType
): boolean {
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

export function useQuranAudio(
  verses: QuranVerseType[],
  opts: AudioMetaOptions = {}
) {
  // global store wires
  const currentUri = useGlobalPlayer((s) => s.currentUri);
  const isPlaying = useGlobalPlayer((s) => s.isPlaying);
  const toggle = useGlobalPlayer((s) => s.toggle);
  const stopRaw = useGlobalPlayer((s) => s.stopAndKeepSource);

  // local
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const idxRef = useRef(-1);
  const requestIdRef = useRef(0);

  const makeTitle = useCallback(
    (v: QuranVerseType) => opts.getTitleFor?.(v) ?? `Ayah ${v.sura}:${v.aya}`,
    [opts]
  );

  const setMetaFor = useCallback(
    (v: QuranVerseType) => {
      useGlobalPlayer.setState({
        title: makeTitle(v),
        artwork: opts.artworkUri,
        currentKey: `quran:${v.sura}:${v.aya}`,
        stoppedByUser: false, // ensure MiniPlayer shows
      });
    },
    [makeTitle, opts.artworkUri]
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
      const urls = buildUrls(verse);

      try {
        const used = await tryReplaceAny(urls);
        if (myId !== requestIdRef.current) return;

        await globalPlayer.play();
        if (myId !== requestIdRef.current) return;

        setCurrentVerseIndex(index);
        idxRef.current = index;
        setMetaFor(verse);

        if (__DEV__)
          console.log("🎵 Playing", verse.sura, ":", verse.aya, "→", used);
      } catch (err) {
        if (myId !== requestIdRef.current) return;
        console.error("❌ Audio load failed", err);
      }
    },
    [verses, setMetaFor]
  );

  const playVerse = useCallback(
    async (_v: QuranVerseType, i: number) => playByIndex(i),
    [playByIndex]
  );

  const toggleVerse = useCallback(
    async (v: QuranVerseType, i: number) => {
      if (uriMatchesVerse(currentUri, v)) {
        toggle();
      } else {
        await playByIndex(i);
      }
    },
    [currentUri, toggle, playByIndex]
  );

  const playNext = useCallback(async () => {
    const next = idxRef.current + 1;
    if (next < verses.length) await playByIndex(next);
  }, [playByIndex, verses.length]);

  const playPrevious = useCallback(async () => {
    const prev = idxRef.current - 1;
    if (prev >= 0) await playByIndex(prev);
  }, [playByIndex]);

  /**
   * Register global next/prev so the root GlobalAutoAdvance can drive the queue
   * even if SuraScreen unmounts. We intentionally DO NOT unregister on unmount.
   * They are cleared when the user presses Stop or when a new session overwrites them.
   */
  useEffect(() => {
    useGlobalPlayer.setState({
      _quranNext: playNext,
      _quranPrev: playPrevious,
    } as any);
  }, [playNext, playPrevious]);

  // Optional: when the verses array identity changes
  useEffect(() => {
    if (idxRef.current >= verses.length) {
      idxRef.current = -1;
      setCurrentVerseIndex(-1);
    }
  }, [verses.length]);

  // Stop that also clears global advancers so auto-advance ends cleanly
  const stop = useCallback(() => {
    stopRaw();
    useGlobalPlayer.setState({
      _quranNext: undefined,
      _quranPrev: undefined,
    } as any);
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
