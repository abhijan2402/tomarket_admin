import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!user) return <Navigate to={`/login?redirect=${pathname}`} />;
  return children;
};

export default AuthGuard;
