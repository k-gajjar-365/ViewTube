import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const likeVideo = async (videoId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(`/likes/video/${videoId}`);
      return extractApiPayload(response);
   }, "Unable to like video");
};

export const unlikeVideo = async (videoId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(`/likes/video/${videoId}`);
      return extractApiPayload(response);
   }, "Unable to unlike video");
};

export const likeComment = async (commentId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(`/likes/comment/${commentId}`);
      return extractApiPayload(response);
   }, "Unable to update comment like");
};

export const likeTweet = async (tweetId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(`/likes/tweet/${tweetId}`);
      return extractApiPayload(response);
   }, "Unable to update tweet like");
};

export const getLikedVideos = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/likes/videos", { signal });
      const payload = extractApiPayload(response);
      return payload?.[0]?.videos || [];
   }, "Unable to fetch liked videos");
};
