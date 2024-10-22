import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

if (!import.meta.env.VITE_BACKEND_URL) {
  console.log(
    "VITE_BACKEND_URL not found in .env, using default URL:",
    API_URL
  );
}

const apiClient = axios.create({
  baseURL: API_URL + "/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("formData");
  localStorage.removeItem("searchDatacreate");
  localStorage.removeItem("searchDataedit");
  window.location.href = "/";
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    throw new Error(message);
  }
  throw new Error("An unknown error occurred");
};

export default apiClient;
