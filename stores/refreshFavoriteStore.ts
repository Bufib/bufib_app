import { create } from "zustand";

interface FavoritesState {
  refreshTriggerFavorites: number;
  triggerRefreshFavorites: () => void;
}

export const useRefreshFavorites = create<FavoritesState>((set) => ({
  refreshTriggerFavorites: 0,
  triggerRefreshFavorites: () =>
    set((state) => ({
      refreshTriggerFavorites: state.refreshTriggerFavorites + 1, // Toggle the refresh trigger
    })),
}));
