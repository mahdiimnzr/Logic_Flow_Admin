import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 20000,
});

const onSuccess = (response) => response;

const onError = (error) => {
  return error.response;
};

apiClient.interceptors.response.use(onSuccess, onError);

apiClient.interceptors.request.use((config) => {
  delete config.headers.Authorization;
  const token = JSON.parse(localStorage.getItem("token") || "null");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
