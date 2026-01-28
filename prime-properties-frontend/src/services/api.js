import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" }
});

// attach token if present and looks valid
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      if (config.headers && config.headers.Authorization) delete config.headers.Authorization;
    }
  } catch (e) {
    if (config.headers && config.headers.Authorization) delete config.headers.Authorization;
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        toast.error("Session expired or unauthorized. Please login.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
