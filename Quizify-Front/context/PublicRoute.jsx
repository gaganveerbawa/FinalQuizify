import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import toast from "react-hot-toast";

const PublicRoute = ({ element: Component }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>; // Show loading while checking authentication
//   toast.success("Already Logged in!");

  return !user ? <Component/>: <Navigate to="/dashboard" />; // Redirect to dashboard if user is logged in
};

export default PublicRoute;
