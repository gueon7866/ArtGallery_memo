// src/services/api.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const baseURL =
  import.meta?.env?.VITE_API_BASE ||
  import.meta?.env?.REACT_APP_API_BASE ||
  "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // if backend uses cookies
});

// Attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic error normalization
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Network error. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
