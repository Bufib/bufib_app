import { create } from "zustand";
import type { VideoSource, VideoPlayerStatus } from "expo-video";
import { getGlobalPlayer } from "@/player/globalVideo";

type Meta = {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
};

type VideoState = {
  uri?: string;
  playing: boolean;
  status?: VideoPlayerStatus;
  error?: string;
  loadAndPlay: (uri: string, meta?: Meta) => Promise<void>;
  play: () => void;
  pause: () => void;
};

const player = getGlobalPlayer();

export const usePodcastStore = create<VideoState>((set) => {
  // Wire up a couple of useful events
  player.addListener("playingChange", ({ isPlaying }) =>
    set({ playing: isPlaying })
  );
  player.addListener("statusChange", ({ status, error }) =>
    set({ status, error: error?.message })
  );

  return {
    uri: undefined,
    playing: false,
    status: player.status,

    // Set the source (with metadata so lock-screen shows nice info) and play
    loadAndPlay: async (uri, meta) => {
      const source: VideoSource = meta ? { uri, metadata: meta } : uri; // both shapes are valid
      // On iOS, replaceAsync avoids main-thread blocking and deprecation warnings
      await player.replaceAsync(source);
      player.play();
      set({ uri });
    },

    play: () => {
      player.play();
    },

    pause: () => {
      player.pause();
    },
  };
});
