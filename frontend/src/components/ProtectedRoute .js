import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("companyId"); // or any other logic to check authentication

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/users/login" />;
  }

  return children; // If authenticated, render the children (protected route content)
};

export default ProtectedRoute;
