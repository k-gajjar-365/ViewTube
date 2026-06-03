import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const getChannelStats = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/dashboard/stats", { signal });
      return extractApiPayload(response);
   }, "Unable to fetch channel stats");
};

export const getChannelVideos = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/dashboard/videos", { signal });
      const payload = extractApiPayload(response);
      return payload?.videos || [];
   }, "Unable to fetch channel videos");
};
