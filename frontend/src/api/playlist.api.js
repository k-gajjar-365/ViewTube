import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const getPlaylists = async (userId, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/playlist/user/${userId}`, { signal });
      return extractApiPayload(response) || [];
   }, "Unable to fetch playlists");
};

export const getPlaylistById = async (playlistId, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/playlist/${playlistId}`, { signal });
      return extractApiPayload(response);
   }, "Unable to fetch playlist");
};

export const createPlaylist = async (payload) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/playlist", payload);
      return extractApiPayload(response);
   }, "Unable to create playlist");
};

export const updatePlaylist = async (playlistId, payload) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(`/playlist/${playlistId}`, payload);
      return extractApiPayload(response);
   }, "Unable to update playlist");
};

export const deletePlaylist = async (playlistId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.delete(`/playlist/${playlistId}`);
      return extractApiPayload(response);
   }, "Unable to delete playlist");
};

export const addToPlaylist = async (playlistId, videoId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(
         `/playlist/${playlistId}/add/${videoId}`
      );
      return extractApiPayload(response);
   }, "Unable to add video to playlist");
};

export const removeFromPlaylist = async (playlistId, videoId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch(
         `/playlist/${playlistId}/remove/${videoId}`
      );
      return extractApiPayload(response);
   }, "Unable to remove video from playlist");
};
