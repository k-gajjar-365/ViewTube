import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
   const userId = req.user._id;
   const { name, description } = req.body;

   if (name === "" || description === "")
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

const getUserPlaylists = asyncHandler(async (req, res) => {
   const { userId } = req.params;

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

   const playlist = await Playlist.findById(playlistId).select("-owner");

   if (!playlist) throw new ApiError(404, "Playlist not found.");

   return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist Found."));
});


export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist };
