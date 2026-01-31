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

const getSubscribedChannels = asyncHandler(async (req, res) => {
   const { subscriberId } = req.params;

   validateMongoId(subscriberId);

   const subscriber = await User.findById(subscriberId);

   if (!subscriber) throw new ApiError(404, "User does not exist");

   const subscribedChannels = await Subscription.aggregate([
      {
         $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId),
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "channel",
            foreignField: "_id",
            as: "channels",
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
         new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
         )
      );
});

const toggleSubscription = asyncHandler(async (req, res) => {
   const { channelId } = req.params;

   validateMongoId(channelId);

   const channel = await User.findById(channelId);

   if (!channel) throw new ApiError(404, "Channel not found");

   const findIfAlreadySubscribed = await Subscription.findOne({
      $and: [{ subscriber: req.user?._id }, { channel: channelId }],
   });

   
   if (findIfAlreadySubscribed) {
      await Subscription.findByIdAndDelete(findIfAlreadySubscribed._id);

      return res
         .status(200)
         .json(new ApiResponse(200, {}, "Channel Unsubscribed successfully"));
   }

   const subscribe = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
   });

   if (!subscribe?._id)
      throw new ApiError(
         500,
         "Something went wrong while subscribing a channel"
      );

   return res
      .status(200)
      .json(new ApiResponse(200, subscribe, "Channel Subscribed successfully"));
});

export { getUserChannelSubscribers, getSubscribedChannels, toggleSubscription };
