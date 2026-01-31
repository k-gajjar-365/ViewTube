import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";

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



export { toggleVideoLike, toggleCommentLike };
