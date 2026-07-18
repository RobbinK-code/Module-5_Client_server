import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/HomePage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProfilePage from "./pages/ProfilePage";
import MyReviewsPage from "./pages/MyReviewsPage";
import AdminAnimeFormPage from "./pages/AdminAnimeFormPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* --- Public routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/anime/:id" element={<AnimeDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* --- Protected routes (any logged-in user) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reviews/mine" element={<MyReviewsPage />} />
            </Route>

            {/* --- Protected routes (admin only) --- */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin/anime/new" element={<AdminAnimeFormPage />} />
              <Route path="/admin/anime/:id/edit" element={<AdminAnimeFormPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
