import { triggerRefreshFavoritesType } from "@/constants/Types";
import { create } from "zustand";


export const useRefreshFavorites = create<triggerRefreshFavoritesType>((set) => ({
  refreshTriggerFavorites: 0,
  triggerRefreshFavorites: () =>
    set((state) => ({
      refreshTriggerFavorites: state.refreshTriggerFavorites + 1, // Toggle the refresh trigger
    })),
}));
