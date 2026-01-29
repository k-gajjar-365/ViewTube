import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isEmptyString } from "../utils/isEmptyString.js";
import { validateMongoId } from "../utils/validateMongoId.js";

const createTweet = asyncHandler(async (req, res) => {
   const { content } = req.body;
   const userId = req.user._id;

   if (isEmptyString(content))
      throw new ApiError(400, "Tweet content required");

   const tweet = await Tweet.create({
      content,
      owner: userId,
   });

   if (!tweet)
      throw new ApiError(500, "Something went wrong while creating tweet");

   return res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully."));
});

const getUserTweets = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   validateMongoId(userId);

   const user = await User.findById(userId);

   if (!user) throw new ApiError(404, "User not found");

   const tweets = await Tweet.find({
      owner: new mongoose.Types.ObjectId(userId),
   });

   const totalTweets = tweets.length;

   if (tweets.length === 0)
      return res
         .status(200)
         .json(
            new ApiResponse(
               200,
               { totalTweets },
               "No tweets found on this account"
            )
         );

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { tweets, totalTweets },
            "Tweets fetched successfully"
         )
      );
});

const updateTweet = asyncHandler(async (req, res) => {
   const { content } = req.body;
   const { tweetId } = req.params;

   validateMongoId(tweetId);

   if (isEmptyString(content))
      throw new ApiError(400, "Tweet content is required");

   const tweet = await Tweet.findById(tweetId);

   if (!tweet) throw new ApiError(404, "Tweet not found");

   if (!tweet.owner.equals(req.user?._id))
      throw new ApiError(
         401,
         "Not authorized to make changes on tweet content"
      );

   const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
         content,
      },
      { new: true }
   );

   if (!updateTweet)
      throw new ApiError(
         500,
         "Something went wrong while updating tweet content"
      );

   return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
   const { tweetId } = req.params;

   validateMongoId(tweetId);

   const tweet = await Tweet.findById(tweetId);

   if (!tweet) throw new ApiError(404, "Tweet not found");

   if (!tweet.owner.equals(req.user?._id))
      throw new ApiError(401, "Not authorized to modify tweet");

   await Tweet.findByIdAndDelete(tweet);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
