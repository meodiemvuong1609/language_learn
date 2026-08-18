import axios from "axios";
import Cookies from "js-cookie";
import store from "./index";
import { logout } from "./authSlice";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle 401 Unauthorized - token expired or invalid
    if (response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      store.dispatch(logout());
      // Redirect to login if not already there
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (response?.status === 403) {
      console.error("Forbidden: You don't have permission to access this resource");
    }

    // Handle 500 Server Error
    if (response?.status >= 500) {
      console.error("Server error occurred. Please try again later.");
    }

    return Promise.reject(error);
  }
);
