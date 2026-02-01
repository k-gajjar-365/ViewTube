import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

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

export { getChannelVideos };
