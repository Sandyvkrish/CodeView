import axios from "axios";

const axiosInstance = axios.create({
  // Use VITE_API_URL locally (http://localhost:3000/api), fallback to relative pathing in production
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export default axiosInstance;
