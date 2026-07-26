import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null, // { id, username, profilePicture, role }

      isAuthenticated: () => Boolean(get().token),

      setSession: (token, user) => set({ token, user }),

      updateUser: (patch) => set({ user: { ...get().user, ...patch } }),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'ana-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
