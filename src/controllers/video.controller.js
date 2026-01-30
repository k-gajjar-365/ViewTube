import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isEmptyString } from "../utils/isEmptyString.js";
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
   )
});

export { publishVideo };
