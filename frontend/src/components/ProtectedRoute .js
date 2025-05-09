import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// ProtectedRoute component checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem("token");

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  return children; 
};

export default ProtectedRoute;
