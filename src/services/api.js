import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
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