import axios from "axios";

export const API_PREFIX = "api/v1";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${API_PREFIX}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  },
);
