// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "@/utils/supabase";
// import { Session } from "@supabase/supabase-js";

// type AuthStore = {
//   session: Session | null;
//   username: string;
//   isAdmin: boolean;
//   isModerator: boolean;
//   isLoggedIn: boolean;
//   isPersisted: boolean;
//   setSession: (session: Session | null, persist: boolean) => Promise<void>;
//   clearSession: () => Promise<void>;
//   restoreSession: () => Promise<boolean>;
//   getUserRole: (
//     userId: string
//   ) => Promise<{ role: string | null; username: string | null }>;
// };

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set, get) => ({
//       session: null,
//       isAdmin: false,
//       isModerator: false,
//       isLoggedIn: false,
//       isPersisted: false,
//       username: "",

//       // Fetch user role from the user_role table
//       async getUserRole(
//         userId: string
//       ): Promise<{ role: string | null; username: string | null }> {
//         try {
//           const { data, error } = await supabase
//             .from("users")
//             .select("role, username")
//             .eq("user_id", userId)
//             .single();

//           if (error) {
//             console.error("Error fetching user role:", error);
//             return { role: null, username: null };
//           }

//           return {
//             role: data?.role || null,
//             username: data?.username || "",
//           };
//         } catch (err) {
//           console.error("Unexpected error fetching user role:", err);
//           return { role: null, username: null };
//         }
//       },

//       //  Set a new session and determine user role
//       setSession: async (session: Session | null, persist: boolean) => {
//         try {
//           if (session) {
//             // Fetch the user's role from the user_roles table
//             console.log(session.user.id);
//             const { role, username } = await get().getUserRole(session.user.id);

//             const isAdmin = role === "admin";
//             const isModerator = role === "moderator";

//             // Update the state (Zustand persist will handle storage)
//             set({
//               session,
//               isAdmin,
//               isModerator,
//               isLoggedIn: true,
//               isPersisted: persist,
//               username: username || "",
//             });
//           }
//         } catch (error) {
//           console.error("Failed to save session data:", error);
//         }
//       },

//       // Clear the session and reset the state
//       clearSession: async () => {
//         try {
//           await supabase.auth.signOut();
//           set({
//             session: null,
//             isAdmin: false,
//             isModerator: false,
//             isLoggedIn: false,
//             isPersisted: false,
//             username: "",
//           });
//         } catch (error) {
//           console.error("Failed to clear session:", error);
//         }
//       },

//       // Restore the session and user role from persisted storage
//       restoreSession: async () => {
//         try {
//           const {
//             data: { session: currentSession },
//           } = await supabase.auth.getSession();

//           // Check if session is expired or invalid
//           if (!currentSession) {
//             await get().clearSession();
//             return false;
//           }

//           // Fetch the user's role and username
//           const { role, username } = await get().getUserRole(
//             currentSession.user.id
//           );

//           // Compare role properly
//           const isAdmin = role === "admin";
//           const isModerator = role === "moderator";

//           // Update the state with session, role, and username
//           set({
//             session: currentSession,
//             isAdmin,
//             isModerator,
//             isLoggedIn: true,
//             isPersisted: true,
//             username: username || "",
//           });
//           return true;
//         } catch (error) {
//           console.error("Failed to restore session:", error);
//           await get().clearSession();
//           return false;
//         }
//       },
//     }),
//     {
//       name: "auth-storage", // Unique key in AsyncStorage
//       storage: createJSONStorage(() => AsyncStorage), // Uses AsyncStorage for persistence
//     }
//   )
// );

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";

type AuthStore = {
  // ❌ REMOVED: session (Supabase handles this internally)
  // ❌ REMOVED: isPersisted (not needed)

  // ✅ KEEP: Only store derived/custom data
  userId: string | null;
  username: string;
  isAdmin: boolean;
  isModerator: boolean;
  isLoggedIn: boolean;

  // Actions
  setUserData: (
    userId: string,
    username: string,
    isAdmin: boolean,
    isModerator: boolean
  ) => void;
  clearUserData: () => void;
  initializeAuth: () => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userId: null,
      username: "",
      isAdmin: false,
      isModerator: false,
      isLoggedIn: false,

      // ✅ Set user data from session
      setUserData: (
        userId: string,
        username: string,
        isAdmin: boolean,
        isModerator: boolean
      ) => {
        set({
          userId,
          username,
          isAdmin,
          isModerator,
          isLoggedIn: true,
        });
      },

      // ✅ Clear user data
      clearUserData: () => {
        set({
          userId: null,
          username: "",
          isAdmin: false,
          isModerator: false,
          isLoggedIn: false,
        });
      },

      // ✅ Initialize auth listener (call this once in root component)
      initializeAuth: () => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            syncUserData(session.user.id, set);
          }
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            // User logged in or session refreshed
            await syncUserData(session.user.id, set);
          } else {
            // User logged out
            get().clearUserData();
          }
        });
      },

      // ✅ Sign out
      signOut: async () => {
        await supabase.auth.signOut();
        get().clearUserData();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // ✅ Only persist user metadata, NOT the session
      partialize: (state) => ({
        userId: state.userId,
        username: state.username,
        isAdmin: state.isAdmin,
        isModerator: state.isModerator,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

// ✅ Helper function to fetch and sync user role/username
async function syncUserData(
  userId: string,
  set: (partial: Partial<AuthStore>) => void
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("role, username")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return;
    }

    const username = data?.username || "";
    const role = data?.role || null;
    const isAdmin = role === "admin";
    const isModerator = role === "moderator";

    set({
      userId,
      username,
      isAdmin,
      isModerator,
      isLoggedIn: true,
    });
  } catch (err) {
    console.error("Unexpected error syncing user data:", err);
  }
}
