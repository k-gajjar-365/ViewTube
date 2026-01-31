import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isEmptyString } from "../utils/isEmptyString.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { validateMongoId } from "../utils/validateMongoId.js";

const addComment = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   const { content } = req.body;

   validateMongoId(videoId);

   if (isEmptyString(content))
      throw new ApiError(400, "Comment content is required");

   const foundVideo = await Video.findById(videoId);

   if (!foundVideo) throw new ApiError(404, "Video not found");

   const comment = await Comment.create({
      content,
      video: videoId,
      owner: req.user?._id,
   });

   return res
      .status(201)
      .json(
         new ApiResponse(201, comment, "Comment added to video successfully")
      );
});

export { addComment };
