// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthError, User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

const AUTH_STORAGE_KEY = "pos-bakery-auth";

interface AuthLogin {
    user: User | null,
    error: AuthError | null
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<AuthLogin>;
  logout: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      // cek session supabase saat awal
      hydrateAuth: async () => {
        if (get().isInitialized) return;
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;
        set({
          user,
          isAuthenticated: !!user,
          isInitialized: true,
        });
      },

      // login via supabase
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.session?.user) {
          return { error: error, user: null };
        }

        set({
          user: data.session.user,
          isAuthenticated: true,
          isInitialized: true,
        });

        return { error: null, user: data.session.user};
      },

      // logout supabase
      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      // kita simpan user minimal, tapi supabase tetap sumber kebenaran
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
