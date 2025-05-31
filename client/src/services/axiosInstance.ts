import { logoutUser } from "@/features/auth/authSlice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const setupInterceptors = (store: any) => {
  console.log("setup interceptor");

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log("Interceptor triggered", error.response?.status);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("Attempting to refresh token...");
          const response = await axiosInstance.post("/auth/refresh");
          console.log("Token refresh successful");
          await new Promise((resolve) => setTimeout(resolve, 100));
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.log("Token refresh failed:", refreshError);
          store.dispatch(logoutUser());
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
