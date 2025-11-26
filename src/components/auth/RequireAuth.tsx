// src/components/auth/RequireAuth.tsx
import { type ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isInitialized, hydrateAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      void hydrateAuth();
    }
  }, [isInitialized, hydrateAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
