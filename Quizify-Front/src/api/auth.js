import axios from "axios";
import { BACKEND_URL } from "../utils/constant.js";

export const register = ({ name, email, password }) => {
  try {
    const response = axios.post(
      `${BACKEND_URL}/auth/register`,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    // localStorage.setItem("token", response.data.token);

    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return new Error(error.response.data.message);
  }
};
