import axios from "axios";

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL,
   withCredentials: true,
});

axiosInstance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         localStorage.removeItem("accessToken");
         window.dispatchEvent(new Event("auth:logout"));

         if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/signup"
         ) {
            window.location.href = "/login";
         }
      }

      return Promise.reject(error);
   }
);

export default axiosInstance;
