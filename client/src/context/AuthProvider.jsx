import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [loggedIn, setIsLoggedin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setIsLoggedin(false);
          setToken(null);
          localStorage.removeItem("token");
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/login", { email, password });
      setIsLoggedin(true);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loggedIn,
    token,
    loading,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
