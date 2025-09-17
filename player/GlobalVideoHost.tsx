// // // // GlobalVideoHost.tsx
// // // import React, { PropsWithChildren } from "react";
// // // import { createVideoPlayer, VideoView, type VideoPlayer } from "expo-video";

// // // const PLAYER_KEY = Symbol.for("app/globalVideoPlayer");

// // // function getOrCreatePlayer(): VideoPlayer {
// // //   const g = globalThis as any;
// // //   if (!g[PLAYER_KEY]) {
// // //     const p = createVideoPlayer(null);
// // //     p.staysActiveInBackground = true;
// // //     p.showNowPlayingNotification = true;
// // //     p.audioMixingMode = "auto";
// // //     p.timeUpdateEventInterval = 0.5;
// // //     g[PLAYER_KEY] = p;
// // //   }
// // //   return g[PLAYER_KEY] as VideoPlayer;
// // // }

// // // export const globalPlayer = getOrCreatePlayer();

// // // export function GlobalVideoHost({ children }: PropsWithChildren<{}>) {
// // //   return (
// // //     <>
// // //       {children}
// // //       <VideoView
// // //         player={globalPlayer}
// // //         allowsPictureInPicture
// // //         style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
// // //         pointerEvents="none"
// // //       />
// // //     </>
// // //   );
// // // }

// // // export default GlobalVideoHost;

// // // GlobalVideoHost.tsx

// // //! Worked bis jetzt
// // import React, { PropsWithChildren } from "react";
// // import { createVideoPlayer, VideoView, type VideoPlayer } from "expo-video";

// // const PLAYER_KEY = Symbol.for("app/globalVideoPlayer");

// // function getOrCreatePlayer(): VideoPlayer {
// //   const g = globalThis as any;
// //   if (!g[PLAYER_KEY]) {
// //     const p = createVideoPlayer(null);
// //     p.staysActiveInBackground = true;
// //     p.showNowPlayingNotification = true;
// //     p.audioMixingMode = "auto";
// //     p.timeUpdateEventInterval = 0.5;
// //     // custom app-private flags/tags
// //     (p as any).__stoppedByUser = false;
// //     (p as any).__currentUri = undefined;
// //     (p as any).__currentKey = undefined;
// //     (p as any).__title = undefined;
// //     (p as any).__artwork = undefined;
// //     (p as any).__podcastId = undefined;
// //     (p as any).__filename = undefined;

// //     g[PLAYER_KEY] = p;
// //   }
// //   return g[PLAYER_KEY] as VideoPlayer;
// // }

// // export const globalPlayer = getOrCreatePlayer();

// // export function GlobalVideoHost({ children }: PropsWithChildren<{}>) {
// //   return (
// //     <>
// //       {children}
// //       <VideoView
// //         player={globalPlayer}
// //         allowsPictureInPicture
// //         style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
// //         pointerEvents="none"
// //       />
// //     </>
// //   );
// // }

// // export default GlobalVideoHost;

// // GlobalVideoHost.tsx

// //! Last used
// import React, { PropsWithChildren } from "react";
// import { createVideoPlayer, VideoView, type VideoPlayer } from "expo-video";

// const PLAYER_KEY = Symbol.for("app/globalVideoPlayer");

// function getOrCreatePlayer(): VideoPlayer {
//   const g = globalThis as any;
//   if (!g[PLAYER_KEY]) {
//     const p = createVideoPlayer(null);
//     p.staysActiveInBackground = true;
//     p.showNowPlayingNotification = true;
//     p.audioMixingMode = "auto";
//     p.timeUpdateEventInterval = 0.5;

//     // app-private flags/tags
//     (p as any).__stoppedByUser = false;
//     (p as any).__currentUri = undefined;
//     (p as any).__currentKey = undefined;
//     (p as any).__title = undefined;
//     (p as any).__artwork = undefined;
//     (p as any).__podcastId = undefined;
//     (p as any).__filename = undefined;

//     // ✅ Unified stops
//     (p as any).stopAndKeepSource = async () => {
//       try { p.pause(); } catch {}
//       try { p.currentTime = 0; } catch {}
//       (p as any).__stoppedByUser = true;     // hide Mini, don't unload source
//       // keep __currentKey/__currentUri etc. so full player still has controls
//     };

//     (p as any).stopAndUnload = async () => {
//       try { p.pause(); } catch {}
//       try { await p.replaceAsync(null); } catch {}
//       try { p.currentTime = 0; } catch {}
//       (p as any).__stoppedByUser = true;
//       (p as any).__currentUri = undefined;
//       (p as any).__currentKey = undefined;
//       (p as any).__title = undefined;
//       (p as any).__artwork = undefined;
//       (p as any).__podcastId = undefined;
//       (p as any).__filename = undefined;
//     };

//     g[PLAYER_KEY] = p;
//   }
//   return g[PLAYER_KEY] as VideoPlayer;
// }

// export const globalPlayer = getOrCreatePlayer();

// export function GlobalVideoHost({ children }: PropsWithChildren<{}>) {
//   return (
//     <>
//       {children}
//       <VideoView
//         player={globalPlayer}
//         allowsPictureInPicture
//         style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
//         pointerEvents="none"
//       />
//     </>
//   );
// }

// export default GlobalVideoHost;
// /player/GlobalVideoHost.tsx

// /player/GlobalVideoHost.tsx
import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { VideoView } from "expo-video";
import { useEvent } from "expo";
import { globalPlayer, useGlobalPlayer } from "./useGlobalPlayer";

export { globalPlayer } from "./useGlobalPlayer";

export default function GlobalVideoHost({ children }: PropsWithChildren<{}>) {
  const setPlaying = useGlobalPlayer((s) => s._setPlaying);
  const setTime = useGlobalPlayer((s) => s._setTime);
  const setStatus = useGlobalPlayer((s) => s._setStatus);

  // playingChange
  const playingEvt = useEvent(globalPlayer, "playingChange");
  React.useEffect(() => {
    if (playingEvt) setPlaying(!!playingEvt.isPlaying);
  }, [playingEvt, setPlaying]);

  // timeUpdate (no initial payload → no type mismatch)
  const timeEvt = useEvent(globalPlayer, "timeUpdate");
  const lastTick = React.useRef(0);
  React.useEffect(() => {
    const now = Date.now();
    if (now - lastTick.current >= 200) {
      const cur =
        typeof timeEvt?.currentTime === "number"
          ? timeEvt.currentTime
          : globalPlayer.currentTime ?? 0;
      const dur =
        typeof globalPlayer.duration === "number" ? globalPlayer.duration : undefined;
      setTime(cur, dur);
      lastTick.current = now;
    }
  }, [timeEvt, setTime]);

  // sourceLoad → ready
  const sourceLoadEvt = useEvent(globalPlayer, "sourceLoad");
  React.useEffect(() => {
    if (sourceLoadEvt) setStatus("ready");
  }, [sourceLoadEvt, setStatus]);

  return (
    <>
      {children}
      <View
        pointerEvents="none"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
      >
        <VideoView
          player={globalPlayer}
          allowsPictureInPicture
          nativeControls={false}
        />
      </View>
    </>
  );
}
