import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { validateMongoId } from "../utils/validateMongoId.js";
import { isEmptyString } from "../utils/isEmptyString.js";

const createPlaylist = asyncHandler(async (req, res) => {
   const userId = req.user._id;
   const { name, description } = req.body;
   validateMongoId(userId);

   if (isEmptyString(name) || isEmptyString(description))
      throw new ApiError(
         400,
         "Both playlist name and playlist description are required"
      );

   const playlist = await Playlist.create({
      name,
      description,
      owner: userId,
   });

   const responseData = await Playlist.findById(playlist._id).select("-owner");

   if (!responseData)
      throw new ApiError(
         500,
         "Something went wrong while creating new playlist"
      );

   return res
      .status(201)
      .json(
         new ApiResponse(201, responseData, "Playlist created successfully.")
      );
});

const updatePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;
   const { name, description } = req.body;

   if (isEmptyString(name) || isEmptyString(description))
      throw new ApiError(400, "both name and description is required");

   validateMongoId(playlistId);

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) throw new ApiError(400, "Playlist does not exists");

   if (!playlist.owner.equals(req.user._id))
      throw new ApiError(403, "Not authorized to make changes in the playlist");

   const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
         $set: {
            name,
            description,
         },
      },
      { new: true }
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatePlaylist, "Playlist updated successfully")
      );
});

const deletePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;

   validateMongoId(playlistId);

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) throw new ApiError(400, "Playlist does not exists");

   if (!playlist.owner.equals(req.user._id))
      throw new ApiError(403, "Not authorized to make changes in the playlist");

   const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist Deleted successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   validateMongoId(userId);

   if (!userId) throw new ApiError(500, "User not found");

   const playlists = await Playlist.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId),
         },
      },
      {
         $addFields: {
            totalVideos: {
               $size: "$videos",
            },
         },
      },
      {
         $project: {
            name: 1,
            description: 1,
            videos: 1,
            totalVideos: 1,
            owner: 1,
         },
      },
   ]);

   if (playlists.length === 0)
      return res
         .status(200)
         .json(new ApiResponse(200, [], "No playlist found in this account"));

   return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlist fetched successfully."));
});

const getPlaylistById = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;

   validateMongoId(playlistId);

   const playlist = await Playlist.findById(playlistId).select("-owner");

   if (!playlist) throw new ApiError(404, "Playlist not found.");

   return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist Found."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params;

   validateMongoId(playlistId);
   validateMongoId(videoId);

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) throw new ApiError(404, "Playlist not found.");

   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video not found.");
   
   if (!playlist.owner.equals(req.user._id))
      throw new ApiError(403, "Not authorized to make changes in the playlist");

   const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlist,
      {
         $addToSet: { videos: videoId },
      },
      { new: true }
   );

   return res
      .status(201)
      .json(
         new ApiResponse(
            201,
            updatedPlaylist,
            "Video added to playlist successfully"
         )
      );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    
   const { playlistId, videoId } = req.params;

   validateMongoId(playlistId);
   validateMongoId(videoId);

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) throw new ApiError(404, "Playlist does not exists");
   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video does not exists");

   if (!playlist.owner.equals(req.user._id))
      throw new ApiError(403, "Not authorized to make changes on the playlist");

   const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlist,
      {
         $pull: {
            videos: videoId,
         },
      },
      { new: true }
   );

   return res
   .status(200)
   .json(
    new ApiResponse(200, {}, "Video removed successfully")
   )
});

export {
   createPlaylist,
   getUserPlaylists,
   getPlaylistById,
   updatePlaylist,
   deletePlaylist,
   addVideoToPlaylist,
   removeVideoFromPlaylist
};
