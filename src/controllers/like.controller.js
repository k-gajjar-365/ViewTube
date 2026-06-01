import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   validateMongoId(videoId);

   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video not found");

   const findIfAlreadyLiked = await Like.findOne({
      $and: [{ video: videoId }, { likedBy: req.user._id }],
   });

   if (!findIfAlreadyLiked) {
      const like = await Like.create({
         video: videoId,
         likedBy: req.user._id,
      });

      if (!like)
         throw new ApiError(500, "Something went wrong while liking the video");

      return res.status(201).json(new ApiResponse(201, like, "Video Liked"));
   }

   await Like.findByIdAndDelete(findIfAlreadyLiked._id);

   return res.status(200).json(new ApiResponse(200, {}, "Video Unliked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
   const { commentId } = req.params;

   validateMongoId(commentId);

   const comment = await Comment.findById(commentId);

   if (!comment) throw new ApiError(404, "Comment not found");

   const findIfAlreadyLiked = await Like.findOne({
      $and: [{ comment: commentId }, { likedBy: req.user._id }],
   });

   if (findIfAlreadyLiked) {
      await Like.findByIdAndDelete(findIfAlreadyLiked._id);

      return res.status(200).json(new ApiResponse(200, {}, "Comment Unliked"));
   }

   const like = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
   });

   if (!like)
      throw new ApiError(500, "Something went wrong while liking a comment");

   return res.status(201).json(new ApiResponse(201, like, "Comment Liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
   const { tweetId } = req.params;

   validateMongoId(tweetId);

   const tweet = await Tweet.findById(tweetId);

   if (!tweet) throw new ApiError(404, "Tweet not found");

   const findIfAlreadyLiked = await Like.findOne({
      $and: [{ tweet: tweetId }, { likedBy: req.user._id }],
   });

   if (findIfAlreadyLiked) {
      await Like.findByIdAndDelete(findIfAlreadyLiked._id);

      return res.status(200).json(new ApiResponse(200, {}, "Tweet Unliked"));
   }

   const like = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
   });

   if (!like)
      throw new ApiError(500, "Something went wrong while liking a Tweet");

   return res.status(201).json(new ApiResponse(201, like, "Tweet Liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
   const likedVideos = await Like.aggregate([
      {
         $match: {
            likedBy: new mongoose.Types.ObjectId(req.user._id),
         },
      },
      {
         $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "video",
            pipeline: [
               {
                  $lookup: {
                     from: "users",
                     localField: "owner",
                     foreignField: "_id",
                     as: "owner",
                     pipeline: [
                        {
                           $project: {
                              username: 1,
                              avatar: 1,
                           },
                        },
                     ],
                  },
               },
               {
                  $project: {
                     _id: 0,
                     title: 1,
                     videoFile: 1,
                     thumbnail: 1,
                     duration: 1,
                     owner: 1,
                  },
               },
               {
                  $unwind: "$owner",
               },
            ],
         },
      },
      {
         $unwind: "$video",
      },
      {
         $group: {
            _id: null,
            videos: { $push: "$video" },
         },
      },
      {
         $project: {
            _id: 0,
            videos: 1,
         },
      },
   ]);

   if (likedVideos?.length === 0)
      return res
         .status(200)
         .json(new ApiResponse(200, {}, "Do not have any liked videos yet"));

   return res
      .status(200)
      .json(
         new ApiResponse(200, likedVideos, "Fetched liked videos successfully")
      );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
