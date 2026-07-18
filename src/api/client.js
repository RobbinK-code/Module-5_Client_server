import axios from "axios";

// Every environment (local dev, Render, Vercel preview) points this at the
// right backend via an env var, so nothing is hardcoded here.
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every outgoing request, if we have one.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("aniblog_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: if the token is invalid/expired, clear it so the
// UI falls back to a logged-out state instead of silently failing forever.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("aniblog_token");
      localStorage.removeItem("aniblog_user");
    }
    return Promise.reject(error);
  }
);

export default client;
