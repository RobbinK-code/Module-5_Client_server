import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getMe, updateMe as apiUpdateMe } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is already in storage, fetch the profile it
  // belongs to so a page refresh doesn't log the user out.
  useEffect(() => {
    const token = localStorage.getItem("aniblog_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("aniblog_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem("aniblog_token", res.data.access_token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const res = await registerUser({ username, email, password });
    localStorage.setItem("aniblog_token", res.data.access_token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aniblog_token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await apiUpdateMe(payload);
    setUser(res.data);
    return res.data;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
