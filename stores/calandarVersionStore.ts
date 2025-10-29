import { create } from "zustand";

interface CalendarVersionStore {
  calendarVersion: number;
  incrementCalendarVersion: () => void;
  resetVersions: () => void;
}

export const useCalendarVersionStore = create<CalendarVersionStore>((set) => ({
  calendarVersion: 0,
  calendarLegendVersion: 0,

  incrementCalendarVersion: () =>
    set((state) => ({ calendarVersion: state.calendarVersion + 1 })),

  resetVersions: () => set({ calendarVersion: 0 }),
}));
