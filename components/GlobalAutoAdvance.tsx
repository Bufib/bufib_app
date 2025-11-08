// player/GlobalAutoAdvance.tsx
import React from "react";
import { useGlobalPlayer } from "@/player/useGlobalPlayer";

/**
 * Root-mounted watcher that advances to the next verse when the current one ends.
 * It calls store fields `_quranNext/_quranPrev` that useQuranAudio registers.
 */
export default function GlobalAutoAdvance() {
  const isPlaying = useGlobalPlayer((s) => s.isPlaying);
  const position = useGlobalPlayer((s) => s.position);
  const duration = useGlobalPlayer((s) => s.duration);
  const nextFn = useGlobalPlayer(
    (s) => (s as any)._quranNext as (() => void) | undefined
  );

  //! New
  const isQuran = useGlobalPlayer(
    (s) =>
      typeof (s as any).currentKey === "string" &&
      (s as any).currentKey.startsWith("quran:")
  );

  const lockRef = React.useRef(false);
  React.useEffect(() => {
    if (!isQuran) return; //! New

    const d = duration ?? 0;
    const p = position ?? 0;
    const nearEnd = d > 0 && p >= d - 0.25;

    if (isPlaying && nearEnd && !lockRef.current) {
      lockRef.current = true;
      nextFn?.();
    }
    if (!nearEnd) lockRef.current = false;
  }, [isPlaying, position, duration, nextFn, isQuran]);

  return null;
}
