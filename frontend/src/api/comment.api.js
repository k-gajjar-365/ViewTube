import axiosInstance from "./axiosInstance";
import {
   extractApiPayload,
   normalizePaginatedDocs,
   withApiTryCatch,
} from "./apiUtils";

export const getComments = async (
   videoId,
   { page = 1, limit = 20, signal } = {}
) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/comments/${videoId}`, {
         params: { page, limit },
         signal,
      });

      const payload = extractApiPayload(response);

      if (!payload?.docs) {
         return normalizePaginatedDocs({});
      }

      return normalizePaginatedDocs(payload);
   }, "Unable to fetch comments");
};

export const addComment = async (videoId, content) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(`/comments/${videoId}`, { content });
      return extractApiPayload(response);
   }, "Unable to post comment");
};

export const updateComment = async (commentId, content) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(`/comments/c/${commentId}`, {
         content,
      });
      return extractApiPayload(response);
   }, "Unable to update comment");
};

export const deleteComment = async (commentId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.delete(`/comments/c/${commentId}`);
      return extractApiPayload(response);
   }, "Unable to delete comment");
};
