import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
   const userId = req.user._id;
   const { name, description } = req.body;

   if(name === "" || description === "") throw new ApiError(400, "Both playlist name and playlist description are required")

   const playlist = await Playlist.create({
        name,
        description,
        owner: userId
   });

   const responseData = await Playlist.findById(playlist._id).select("-owner");

   if(!responseData) throw new ApiError(500, "Something went wrong while creating new playlist")

    return res
    .status(200)
    .json(
        new ApiResponse(200, responseData, "Playlist created successfully.")
    )

});



export {
    createPlaylist
}
