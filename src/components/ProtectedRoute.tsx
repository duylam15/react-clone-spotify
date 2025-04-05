import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireUser?: boolean;
  requireStaff?: boolean;
  requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireUser,
  requireStaff,
  requireProfile,
}) => {
  const isStaff = localStorage.getItem("isStaff");
  const isLoggedIn = localStorage.getItem("idLogin") == undefined ? false : true

  // // Nếu chưa login
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  // Truy cập route chỉ dành cho user thường
  if (requireUser && isStaff === "true") {
    return <Navigate to="/admin" replace />;
  }

  // Truy cập route chỉ dành cho admin
  if (requireStaff && isStaff !== "true") {
    return <Navigate to="/" replace />;
  }

  // Truy cập route profile: phải là user thường
  if (requireProfile && isStaff !== "false") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
