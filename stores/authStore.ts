//! Last worked
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

type AuthStore = {
  session: Session | null;
  username: string;
  isAdmin: boolean;
  isModerator: boolean;
  isLoggedIn: boolean;
  isPersisted: boolean;
  setSession: (session: Session | null, persist: boolean) => Promise<void>;
  clearSession: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  getUserRole: (
    userId: string
  ) => Promise<{ role: string | null; username: string | null }>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      isAdmin: false,
      isModerator: false,
      isLoggedIn: false,
      isPersisted: false,
      username: "",

      // Fetch user role from the user_role table
      async getUserRole(
        userId: string
      ): Promise<{ role: string | null; username: string | null }> {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("role, username")
            .eq("user_id", userId)
            .single();

          if (error) {
            console.error("Error fetching user role:", error);
            return { role: null, username: null };
          }

          return {
            role: data?.role || null,
            username: data?.username || "",
          };
        } catch (err) {
          console.error("Unexpected error fetching user role:", err);
          return { role: null, username: null };
        }
      },

      //  Set a new session and determine user role
      setSession: async (session: Session | null, persist: boolean) => {
        try {
          if (session) {
            // Fetch the user's role from the user_roles table
            console.log(session.user.id);
            const { role, username } = await get().getUserRole(session.user.id);

            const isAdmin = role === "admin";
            const isModerator = role === "moderator";

            // Update the state (Zustand persist will handle storage)
            set({
              session,
              isAdmin,
              isModerator,
              isLoggedIn: true,
              isPersisted: persist,
              username: username || "",
            });
          }
        } catch (error) {
          console.error("Failed to save session data:", error);
        }
      },

      // Clear the session and reset the state
      clearSession: async () => {
        try {
          await supabase.auth.signOut();
          set({
            session: null,
            isAdmin: false,
            isModerator: false,
            isLoggedIn: false,
            isPersisted: false,
            username: "",
          });
        } catch (error) {
          console.error("Failed to clear session:", error);
        }
      },

      // Restore the session and user role from persisted storage
      restoreSession: async () => {
        try {
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();

          // Check if session is expired or invalid
          if (!currentSession) {
            await get().clearSession();
            return false;
          }

          // Fetch the user's role and username
          const { role, username } = await get().getUserRole(
            currentSession.user.id
          );

          // Compare role properly
          const isAdmin = role === "admin";
          const isModerator = role === "moderator";

          // Update the state with session, role, and username
          set({
            session: currentSession,
            isAdmin,
            isModerator,
            isLoggedIn: true,
            isPersisted: true,
            username: username || "",
          });
          return true;
        } catch (error) {
          console.error("Failed to restore session:", error);
          await get().clearSession();
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // Unique key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Uses AsyncStorage for persistence
    }
  )
);
