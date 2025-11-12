import axios from "axios";

const api = axios.create({
  baseURL: "https://facturafast-8lfi.onrender.com/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  // ✅ Evita enviar token en rutas públicas como registro y login
  const isPublicRoute = config.url.includes("registro") || config.url.includes("token");

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;