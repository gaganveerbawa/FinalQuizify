// UserContext.js
import React, { createContext, useState, useEffect } from "react";
// import { verifyToken } from "../api/auth"; // Import your verifyToken function
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../src/api/auth";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await verifyToken(); // Calls your verify token method
          setUser(response.data); // Assuming response contains user data
        } catch (error) {
          setUser(null);
          localStorage.removeItem("token"); // Remove token if it's invalid
          console.error("Token validation failed", error);
        }
      }
      setLoading(false);
    };

    checkUserToken();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, error, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
