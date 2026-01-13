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
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/register", {
        email,
        password,
        role,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendResetOtp = async (email) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/reset-otp", { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedin(false);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    loggedIn,
    token,
    loading,
    login,
    register,
    sendResetOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
