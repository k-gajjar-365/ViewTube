import axiosInstance from "./axiosInstance";
import {
   extractApiPayload,
   normalizePaginatedDocs,
   withApiTryCatch,
} from "./apiUtils";

export const getVideos = async ({
   page = 1,
   limit = 12,
   query = "",
   sortBy = "createdAt",
   sortType = "desc",
   userId,
   signal,
} = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/videos", {
         params: {
            page,
            limit,
            query,
            sortBy,
            sortType,
            userId,
         },
         signal,
      });

      return normalizePaginatedDocs(extractApiPayload(response));
   }, "Unable to fetch videos");
};

export const getVideoById = async (videoId, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/videos/${videoId}`, { signal });
      return extractApiPayload(response);
   }, "Unable to fetch video");
};

export const uploadVideo = async (formData, onUploadProgress) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/videos", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
         onUploadProgress,
      });

      return extractApiPayload(response);
   }, "Unable to upload video");
};

export const updateVideo = async (videoId, formData) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(`/videos/${videoId}`, formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      return extractApiPayload(response);
   }, "Unable to update video");
};

export const deleteVideo = async (videoId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      return extractApiPayload(response);
   }, "Unable to delete video");
};

export const togglePublishVideo = async (videoId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(`/videos/${videoId}/toggle-publish`);
      return extractApiPayload(response);
   }, "Unable to update publish status");
};
