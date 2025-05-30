import { logoutUser } from "@/features/auth/authSlice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const setupInterceptors = (store: any) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axiosInstance.post("/auth/refresh", {});
          const { accessToken } = response.data;
          console.log(accessToken, "access token got in the interceptor");
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          store.dispatch(logoutUser());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
