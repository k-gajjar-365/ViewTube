import axiosInstance from "./axiosInstance";
import { extractApiPayload, withApiTryCatch } from "./apiUtils";

export const getChannel = async (username, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/users/@${username}`, { signal });
      return extractApiPayload(response);
   }, "Unable to fetch channel");
};

export const updateProfile = async (payload) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch("/users/update-account", payload);
      return extractApiPayload(response);
   }, "Unable to update profile");
};

export const updateAvatar = async (formData) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch("/users/avatar", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      return extractApiPayload(response);
   }, "Unable to update avatar");
};

export const updateCoverImage = async (formData) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.patch("/users/cover-image", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      return extractApiPayload(response);
   }, "Unable to update cover image");
};

export const changePassword = async (payload) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post("/users/change-password", payload);
      return extractApiPayload(response);
   }, "Unable to update password");
};

export const getSubscribers = async (channelId, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/subscriptions/channel/${channelId}`, {
         signal,
      });
      const payload = extractApiPayload(response);
      return payload?.[0]?.subscribers || [];
   }, "Unable to fetch subscribers");
};

export const toggleSubscribe = async (channelId) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.post(`/subscriptions/channel/${channelId}`);
      return extractApiPayload(response);
   }, "Unable to update subscription");
};

export const getSubscribedChannels = async (subscriberId, { signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get(`/subscriptions/user/${subscriberId}`, {
         signal,
      });
      const payload = extractApiPayload(response);
      return payload?.[0]?.channels || [];
   }, "Unable to fetch subscribed channels");
};

export const getHistory = async ({ signal } = {}) => {
   return withApiTryCatch(async () => {
      const response = await axiosInstance.get("/users/history", { signal });
      return extractApiPayload(response) || [];
   }, "Unable to fetch watch history");
};
