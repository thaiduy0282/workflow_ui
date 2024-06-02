import axios, { AxiosError, type AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://dev.qworks.ai/metabench/api",
  timeout: 10000,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJpbnRlZ3JhdGlvbnVzZXJAcXdvcmtzLmFpIiwiaWF0IjoxNzA5ODU4MTg2LCJleHAiOjE3NDEzOTQxODZ9.bX6zI0gH4LjSZyhCno0nkbvc-rfK6S0nHzuHaSGe3RRMXLYU-lCYdsV8wxutdcN-_DIH9j0aExE8h_N5PqgfAQ",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
