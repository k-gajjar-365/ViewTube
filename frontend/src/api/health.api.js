import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const healthCheck = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/health-check", { signal });
      return extractApiPayload(response);
   }, "Unable to check service health");
};
