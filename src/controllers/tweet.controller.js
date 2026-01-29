import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";

const createTweet = asyncHandler(async (req, res) => {
   const { content } = req.body;
   const userId = req.user._id;

   if (!content) throw new ApiError(400, "Tweet content required");

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

export { createTweet, getUserTweets };
