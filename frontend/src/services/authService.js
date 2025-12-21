
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Email atau password salah"
        );
      } else if (error.request) {
        throw new Error("Tidak dapat terhubung ke server");
      } else {
        throw new Error("Terjadi kesalahan saat login");
      }
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Registrasi gagal");
      } else if (error.request) {
        throw new Error("Tidak dapat terhubung ke server");
      } else {
        throw new Error("Terjadi kesalahan saat registrasi");
      }
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    return token;
  },

  decodeToken: () => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    const decoded = authService.decodeToken();
    if (!decoded) return false;
    if (decoded.exp) {
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        authService.logout();
        return false;
      }
    }

    return true;
  },

  getCurrentUser: async () => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);

      if (error.response?.status === 401) {
        authService.logout();
      }

      return null;
    }
  },

  isAdmin: () => {
    const decoded = authService.decodeToken();
    if (!decoded) return false;

    if (decoded.role) return decoded.role.includes("admin");
    return false;
  },

  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData);
      const updatedUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Gagal update profile");
      }
      throw error;
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Gagal mengubah password"
        );
      }
      throw error;
    }
  },
};

export const clearInvalidAuth = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("token");
  }

  if (!user || user === "undefined" || user === "null") {
    localStorage.removeItem("user");
  }
};
