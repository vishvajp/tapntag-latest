import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    throw error.response?.data || { message: "An error occurred" };
  }
);

export default api;

export const sendOTP = async (phoneNumber) => {
  try {
    return await api.post("/auth/send-otp", { phoneNumber });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", { phoneNumber, otp });
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const createAccount = async (userData) => {
  try {
    const response = await api.post("/auth/create-account", userData);
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};
