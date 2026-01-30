import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isEmptyString } from "../utils/isEmptyString.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import { Video } from "../models/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
   const { title, description } = req.body;

   if (isEmptyString(title) || isEmptyString(description))
      throw new ApiError(
         400,
         "Both video title and description fields are required"
      );

   const videoLocalPath = req.files?.videoFile[0]?.path;
   const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

   if (!videoLocalPath || !thumbnailLocalPath)
      throw new ApiError(400, "Both video and thumbnail files are required");

   const video = await uploadOnCloudinary(videoLocalPath);
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

   console.log(video);
   console.log(thumbnail);

   if (!video || !thumbnail)
      throw new ApiError(500, "Something went wrong while uploading files");

   const publishedVideo = await Video.create({
      videoFile: video?.secure_url,
      thumbnail: thumbnail?.secure_url,
      title,
      description,
      duration: video?.duration,
      owner: req.user._id,
   });

   return res
      .status(201)
      .json(
         new ApiResponse(201, publishedVideo, "Video uploaded successfully")
      );
});

const getVideoById = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   validateMongoId(videoId);

   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video not found");

   return res.status(200).json(new ApiResponse(200, video, "Video Found"));
});

const deleteVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   validateMongoId(videoId);

   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video not found");

   if (!video.owner.equals(req.user._id))
      throw new ApiError(403, "Not authorized to modify video");

   await Video.findByIdAndDelete(videoId);

   return res
      .status(200)
      .json(new ApiResponse(200, "Video deleted successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   const title = req.body?.title;
   const description = req.body?.description;

   validateMongoId(videoId);

   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video not found");

   if (!video.owner.equals(req.user._id))
      throw new ApiError(403, "Not authorized to modify video");

   let updatedTitle = video.title;
   let updatedDescription = video.description;

   if (title) updatedTitle = title;

   if (description) updatedDescription = description;

   const thumbnailLocalPath = req.file?.path; // only single file. i.e. upload.single("thumbnail")

   let updatedThumbnail = video.thumbnail;
   if (thumbnailLocalPath) {
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      if (!uploadedThumbnail)
         throw new ApiError(
            500,
            "Something went wrong while updating thumbnail"
         );

      updatedThumbnail = uploadedThumbnail?.secure_url;
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         title: updatedTitle,
         description: updatedDescription,
         thumbnail: updatedThumbnail,
      },
      { new: true }
   );

   if (!updatedVideo)
      throw new ApiError(500, "Something went wrong while updating video");

   return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

export { publishVideo, getVideoById, deleteVideo, updateVideo };
