import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";
import { SignInModal } from "./AuthMenu"
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="p-8">Loading your account…</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}