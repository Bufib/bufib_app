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

  // per-dataset updaters
  incrementQuestionsVersion: () => void;
  incrementQuranDataVersion: () => void;
  incrementCalendarVersion: () => void;
  incrementPrayersVersion: () => void;
  incrementPaypalVersion: () => void;

  // per-dataset resets (optional)
  resetQuestionsVersion: () => void;
  resetQuranDataVersion: () => void;
  resetCalendarVersion: () => void;
  resetPrayersVersion: () => void;
  resetPaypalVersion: () => void;

  // all reset (optional)
  resetAllVersions: () => void;
}

export const useDataVersionStore = create<DataVersionStore>((set) => ({
  questionsVersion: 0,
  quranDataVersion: 0,
  calendarVersion: 0,
  prayersVersion: 0,
  paypalVersion: 0,

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

  resetQuestionsVersion: () => set({ questionsVersion: 0 }),
  resetQuranDataVersion: () => set({ quranDataVersion: 0 }),
  resetCalendarVersion: () => set({ calendarVersion: 0 }),
  resetPrayersVersion: () => set({ prayersVersion: 0 }),
  resetPaypalVersion: () => set({ paypalVersion: 0 }),

  resetAllVersions: () =>
    set({
      questionsVersion: 0,
      quranDataVersion: 0,
      calendarVersion: 0,
      prayersVersion: 0,
      paypalVersion: 0,
    }),
}));
