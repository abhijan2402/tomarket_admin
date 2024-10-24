import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";

const GuestGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (user) return <Navigate to={redirectUrl ? redirectUrl : "/dashboard"} />;
  return children;
};

export default GuestGuard;
