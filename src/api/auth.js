import client from "./client";

export const registerUser = (payload) => client.post("/auth/register", payload);

export const loginUser = (payload) => client.post("/auth/login", payload);

export const forgotPassword = (email) =>
  client.post("/auth/forgot-password", { email });

export const resetPassword = (token, new_password) =>
  client.post("/auth/reset-password", { token, new_password });

export const getMe = () => client.get("/auth/me");

export const updateMe = (payload) => client.put("/auth/me", payload);
