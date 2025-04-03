import React from "react";
import { Navigate } from "react-router-dom";

// This is a mock function to check if the user is logged in.
// Replace this with your actual authentication logic.

const RedirectIfLoggedIn = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("userId");
  console.log(isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/dashboard" />; // Redirect to the dashboard if logged in
  }
  return children; // Otherwise, render the child component
};

export default RedirectIfLoggedIn;
