// PrivateRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const PrivateRoute = ({ element: Component }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
