import axios, { AxiosError, type AxiosInstance } from "axios";

const axiosWorkflow: AxiosInstance = axios.create({
  baseURL: "http://20.191.97.36:8090/v1",
  timeout: 10000,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

axiosWorkflow.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosWorkflow.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosWorkflow;
