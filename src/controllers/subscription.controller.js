import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { validateMongoId } from "../utils/validateMongoId.js";

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
   const { channelId } = req.params;

   validateMongoId(channelId);

   const channel = await User.findById(channelId);

   if (!channel) throw new ApiError(404, "Channel does not exist");

   const subscribers = await Subscription.aggregate([
      {
         $match: {
            channel: new mongoose.Types.ObjectId(channelId),
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscribers",
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
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(200, subscribers, "Subscriber fetched successfully")
      );
});

export { getUserChannelSubscribers };
