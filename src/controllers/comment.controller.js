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

const updateComment = asyncHandler(async (req, res) => {

   const { commentId } = req.params;
   const { content } = req.body;

   validateMongoId(commentId);

   if (isEmptyString(content))
      throw new ApiError(400, "Comment content is required");

   const comment = await Comment.findById(commentId);

   if (!comment) throw new ApiError(404, "Comment not found");

   if (!comment.owner.equals(req.user?._id))
      throw new ApiError(403, "Not authorized to make changes on comment");

   const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
});

const deleteComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;

   validateMongoId(commentId);

   const comment = await Comment.findById(commentId);

   if (!comment) throw new ApiError(404, "Comment not found");

   if (!comment.owner.equals(req.user?._id))
      throw new ApiError(403, "Not authorized to make changes on comment");

   await Comment.findByIdAndDelete(commentId);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { addComment, deleteComment, updateComment };
