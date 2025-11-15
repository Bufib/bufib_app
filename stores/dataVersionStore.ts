// src/stores/dataVersionStore.ts
import { create } from "zustand";

export type Dataset = "questions" | "quran" | "calendar" | "prayers" | "paypal";

interface DataVersionStore {
  // per-dataset ticks
  questionsVersion: number;
  quranDataVersion: number;
  calendarVersion: number;
  prayersVersion: number;
  paypalVersion: number;
  podcastVersion: number;
  newsArticleVersion: number;
  videoVersion: number;
  userQuestionVersion: number;
  pdfDataVersion: number;

  // per-dataset updaters
  incrementQuestionsVersion: () => void;
  incrementQuranDataVersion: () => void;
  incrementCalendarVersion: () => void;
  incrementPrayersVersion: () => void;
  incrementPaypalVersion: () => void;
  incrementPodcastVersion: () => void;
  incrementNewsArticleVersion: () => void;
  incrementVideoVersion: () => void;
  incrementUserQuestionVersion: () => void;
  incrementPdfDataVersion: () => void;

  // per-dataset resets (optional)
  resetQuestionsVersion: () => void;
  resetQuranDataVersion: () => void;
  resetCalendarVersion: () => void;
  resetPrayersVersion: () => void;
  resetPaypalVersion: () => void;
  resetPodcastVersion: () => void;
  resetNewsArticleVersion: () => void;
  resetVideoVersion: () => void;
  resetUserQuestionVersion: () => void;
  resetPdfDataVersion: () => void;

  // all reset (optional)
  resetAllVersions: () => void;
}

export const useDataVersionStore = create<DataVersionStore>((set) => ({
  questionsVersion: 0,
  quranDataVersion: 0,
  calendarVersion: 0,
  prayersVersion: 0,
  paypalVersion: 0,
  podcastVersion: 0,
  newsArticleVersion: 0,
  videoVersion: 0,
  userQuestionVersion: 0,
  pdfDataVersion: 0,

  incrementQuestionsVersion: () =>
    set((s) => ({ questionsVersion: s.questionsVersion + 1 })),
  incrementQuranDataVersion: () =>
    set((s) => ({ quranDataVersion: s.quranDataVersion + 1 })),
  incrementCalendarVersion: () =>
    set((s) => ({ calendarVersion: s.calendarVersion + 1 })),
  incrementPrayersVersion: () =>
    set((s) => ({ prayersVersion: s.prayersVersion + 1 })),
  incrementPaypalVersion: () =>
    set((s) => ({ paypalVersion: s.paypalVersion + 1 })),
  incrementPodcastVersion: () =>
    set((s) => ({ podcastVersion: s.podcastVersion + 1 })),
  incrementNewsArticleVersion: () =>
    set((s) => ({ newsArticleVersion: s.newsArticleVersion + 1 })),
  incrementVideoVersion: () =>
    set((s) => ({ videoVersion: s.videoVersion + 1 })),
  incrementUserQuestionVersion: () =>
    set((s) => ({ userQuestionVersion: s.userQuestionVersion + 1 })),
  incrementPdfDataVersion: () =>
    set((s) => ({ pdfDataVersion: s.pdfDataVersion + 1 })),

  resetQuestionsVersion: () => set({ questionsVersion: 0 }),
  resetQuranDataVersion: () => set({ quranDataVersion: 0 }),
  resetCalendarVersion: () => set({ calendarVersion: 0 }),
  resetPrayersVersion: () => set({ prayersVersion: 0 }),
  resetPaypalVersion: () => set({ paypalVersion: 0 }),
  resetPodcastVersion: () => set({ podcastVersion: 0 }),
  resetNewsArticleVersion: () => set({ newsArticleVersion: 0 }),
  resetVideoVersion: () => set({ videoVersion: 0 }),
  resetUserQuestionVersion: () => set({ userQuestionVersion: 0 }),
  resetPdfDataVersion: () => set({ pdfDataVersion: 0 }),

  resetAllVersions: () =>
    set({
      questionsVersion: 0,
      quranDataVersion: 0,
      calendarVersion: 0,
      prayersVersion: 0,
      paypalVersion: 0,
      podcastVersion: 0,
      newsArticleVersion: 0,
      videoVersion: 0,
      userQuestionVersion: 0,
      pdfDataVersion: 0,
    }),
}));
