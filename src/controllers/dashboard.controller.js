import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const getChannelVideos = asyncHandler(async (req, res) => {
   const videos = await Video.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(req.user._id),
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
   const totalVideos = videos.length;
   if (totalVideos === 0)
      return res
         .status(200)
         .json(
            new ApiResponse(
               200,
               { totalVideos, videos },
               "No published videos found on this channel"
            )
         );
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { totalVideos, videos },
            "Videos fetched successfully"
         )
      );
});

export { getChannelVideos };
