import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async(req, res) => {
    
    const { content } = req.body;
    const userId = req.user._id;

    if(!content) 
        throw new ApiError(400, "Tweet content required")

    const tweet = await Tweet.create({
        content,
        owner: userId
    });

    if(!tweet)
        throw new ApiError(500, "Something went wrong while created tweet");
    
    return res
    .status(201)
    .json(
        new ApiResponse(201, tweet, "Tweet created successfully.")
    )

});

export {
    createTweet
}