import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("idLogin") == undefined ? false : true

  if (isLoggedIn) {
    // Nếu đã đăng nhập thì không cho vào các trang login/register nữa
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
