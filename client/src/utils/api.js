import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fisherchain_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUserProfile = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.data?.token) {
    localStorage.setItem("fisherchain_token", response.data.token);
  }
  return response.data;
};

export const loginUserProfile = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  if (response.data?.token) {
    localStorage.setItem("fisherchain_token", response.data.token);
  }
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUserProfile = () => {
  localStorage.removeItem("fisherchain_token");
};

export default api;
