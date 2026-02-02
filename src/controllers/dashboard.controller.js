import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";

const fetchChannelVideosById = async (userId) => {
   return await Video.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId),
         },
      },
      {
         $project: {
            videoFile: 1,
            thumbnail: 1,
            duration: 1,
            isPublished: 1,
         },
      },
   ]);
};

const getChannelVideos = asyncHandler(async (req, res) => {
   const videos = await fetchChannelVideosById(req.user._id);

   const totalVideos = videos.length;

   return res.status(200).json(
      new ApiResponse(
         200,
         { totalVideos, videos },

         totalVideos === 0
            ? "No published video found on this channel"
            : "Video(s) fetched successfully"
      )
   );
});

const getChannelStats = asyncHandler(async (req, res) => {
   const userId = new mongoose.Types.ObjectId(req.user._id);

   const totalSubscribers = (await Subscription.find({ channel: userId }))
      .length;

   const totalVideos = (await fetchChannelVideosById(userId)).length;

   const totalViews = (
      await Video.aggregate([
         {
            $match: {
               owner: userId,
            },
         },
         {
            $group: {
               _id: null,
               views: { $sum: "$views" },
            },
         },
         {
            $project: {
               _id: 0,
               views: 1,
            },
         },
      ])
   )[0]?.views;

   const totalLikes = (
      await Video.aggregate([
         {
            $match: {
               owner: userId,
            },
         },
         {
            $lookup: {
               from: "likes",
               localField: "_id",
               foreignField: "video",
               as: "likes",
            },
         },
         {
            $unwind: "$likes",
         },
         {
            $group: {
               _id: null,
               likes: { $push: "$likes" },
            },
         },
         {
            $addFields: {
               likeCount: { $size: "$likes" },
            },
         },
         {
            $project: {
               likeCount: 1,
               _id: 0,
            },
         },
      ])
   )[0]?.likeCount;

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { totalSubscribers, totalVideos, totalViews, totalLikes },
            "Channel stats fetched succesfully"
         )
      );
});

export { getChannelVideos, getChannelStats };
