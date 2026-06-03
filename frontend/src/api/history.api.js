import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";
import { getHistory as getHistoryFromUserApi } from "./user.api";

export const getHistory = getHistoryFromUserApi;

export const clearHistory = async () => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.delete("/users/history");
      return extractApiPayload(response);
   }, "Clear history is not available in this backend.");
};
