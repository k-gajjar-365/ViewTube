import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const register = async (formData) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/users/register", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
         withCredentials: true
      });

      return extractApiPayload(response);
   }, "Unable to create account");
};

export const login = async (payload) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/users/login", payload, {withCredentials: true});
      return extractApiPayload(response);
   }, "Unable to log in");
};

export const logout = async () => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/users/logout");
      return extractApiPayload(response);
   }, "Unable to log out");
};

export const getMe = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(
         "/users/current-user",
         {},
         { signal }
      );
      const data = extractApiPayload(response);
      return data?.user || null;
   }, "Unable to fetch current user");
};

export const checkAuth = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/users/check-auth", { signal });
      return response?.data?.authenticated ?? false;
   }, "Unable to verify authentication");
};

export const refreshToken = async (refreshTokenValue) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/users/refresh-token", {
         refreshToken: refreshTokenValue,
      });

      return extractApiPayload(response);
   }, "Unable to refresh token");
};
