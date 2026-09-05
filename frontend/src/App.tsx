import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute, PublicOnlyRoute, RootRoute } from "./components/layout/route-guards";
import { AuthProvider } from "./contexts/auth-context";
import { CategoriesPage } from "./pages/categories";
import { DashboardPage } from "./pages/dashboard";
import { ProfilePage } from "./pages/profile";
import { TransactionsPage } from "./pages/transactions";
import { RegisterPage } from "./pages/register";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Deslogado mostra Login; logado mostra o Dashboard. */}
          <Route
            path="/"
            element={
              <RootRoute>
                <DashboardPage />
              </RootRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
