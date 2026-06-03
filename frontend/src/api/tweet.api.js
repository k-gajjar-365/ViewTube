import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const getUserTweets = async (userId, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/tweets/user/${userId}`, { signal });
      const payload = extractApiPayload(response);
      return payload?.tweets || [];
   }, "Unable to fetch tweets");
};

export const createTweet = async (content) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/tweets", { content });
      return extractApiPayload(response);
   }, "Unable to create tweet");
};

export const updateTweet = async (tweetId, content) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(`/tweets/${tweetId}`, { content });
      return extractApiPayload(response);
   }, "Unable to update tweet");
};

export const deleteTweet = async (tweetId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.delete(`/tweets/${tweetId}`);
      return extractApiPayload(response);
   }, "Unable to delete tweet");
};
