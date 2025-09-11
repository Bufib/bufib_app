// // // GlobalVideoHost.tsx
// // import { createVideoPlayer, VideoView } from "expo-video";
// // import React from "react";

// // export const globalPlayer = createVideoPlayer(null);
// // globalPlayer.staysActiveInBackground = true;
// // globalPlayer.showNowPlayingNotification = true;
// // globalPlayer.audioMixingMode = "auto";
// // // emit 'timeUpdate' ~2x/sec so UI stays smooth
// // globalPlayer.timeUpdateEventInterval = 0.5;

// // export function GlobalVideoHost({ children }: { children: React.ReactNode }) {
// //   return (
// //     <>
// //       {children}
// //       <VideoView
// //         player={globalPlayer}
// //         style={{ width: 1, height: 1, opacity: 0, position: "absolute" }}
// //         allowsPictureInPicture
// //       />
// //     </>
// //   );
// // }

// import React, { PropsWithChildren } from "react";
// import {
//   createVideoPlayer,
//   VideoView,
//   type VideoPlayer,
// } from "expo-video";

// /**
//  * Keep a single player instance across Fast Refresh / re-mounts.
//  */
// declare global {
//   // eslint-disable-next-line no-var
//   var __GLOBAL_VIDEO_PLAYER__: VideoPlayer | undefined;
// }

// function getOrCreatePlayer(): VideoPlayer {
//   if (!globalThis.__GLOBAL_VIDEO_PLAYER__) {
//     const p = createVideoPlayer(null);

//     // Background + lock screen controls
//     p.staysActiveInBackground = true;
//     p.showNowPlayingNotification = true;

//     // Sensible default for audio session behavior
//     p.audioMixingMode = "auto";

//     // Emit `timeUpdate` events ~2x/sec for smooth progress UI
//     p.timeUpdateEventInterval = 0.5;

//     globalThis.__GLOBAL_VIDEO_PLAYER__ = p;
//   }
//   return globalThis.__GLOBAL_VIDEO_PLAYER__!;
// }

// export const globalPlayer = getOrCreatePlayer();

// /**
//  * Mount this ONCE at the app root to keep the native player bound.
//  * The hidden VideoView is required for PiP and stable background playback.
//  */
// export function GlobalVideoHost({ children }: PropsWithChildren<{}>) {
//   return (
//     <>
//       {children}
//       <VideoView
//         player={globalPlayer}
//         allowsPictureInPicture
//         // Keep it mounted but invisible and non-interactive
//         style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
//         pointerEvents="none"
//       />
//     </>
//   );
// }

// export default GlobalVideoHost;

// GlobalVideoHost.tsx
import React, { PropsWithChildren } from "react";
import { createVideoPlayer, VideoView, type VideoPlayer } from "expo-video";

const PLAYER_KEY = Symbol.for("app/globalVideoPlayer");

function getOrCreatePlayer(): VideoPlayer {
  const g = globalThis as any;
  if (!g[PLAYER_KEY]) {
    const p = createVideoPlayer(null);
    p.staysActiveInBackground = true;
    p.showNowPlayingNotification = true;
    p.audioMixingMode = "auto";
    p.timeUpdateEventInterval = 0.5;
    g[PLAYER_KEY] = p;
  }
  return g[PLAYER_KEY] as VideoPlayer;
}

export const globalPlayer = getOrCreatePlayer();

export function GlobalVideoHost({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {children}
      <VideoView
        player={globalPlayer}
        allowsPictureInPicture
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        pointerEvents="none"
      />
    </>
  );
}

export default GlobalVideoHost;
