// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          // Expecting { token, user }
          set({ token: data.token, user: data.user, loading: false });
          return data;
        } catch (e) {
          set({ error: e.message, loading: false });
          throw e;
        }
      },

      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post("/auth/register", payload);
          // Some APIs auto-login; if not, just return
          if (data?.token) set({ token: data.token, user: data.user });
          set({ loading: false });
          return data;
        } catch (e) {
          set({ error: e.message, loading: false });
          throw e;
        }
      },

      logout: () => {
        set({ token: null, user: null });
      },

      me: async () => {
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data });
          return data;
        } catch (e) {
          // token invalid, force logout
          set({ token: null, user: null });
          throw e;
        }
      },
    }),
    {
      name: "auth", // localStorage key
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
