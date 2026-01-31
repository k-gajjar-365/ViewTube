import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
   // get video id from params
   // validate mongo id
   // find if video exists
   // check if already liked. if yes, then delete that liked document
   // return response

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

   return res.status(201).json(new ApiResponse(201, {}, "Video Unliked"));
});

export { toggleVideoLike };
