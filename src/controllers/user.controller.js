import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = await req.body;

  if (email === "" || username === "" || fullName === "" || password === "") {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists.");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  console.log(avatarLocalPath);
  console.log(coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }

  const user = await User.create({
    fullName,
    email,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
    password,
    username: username.toLowerCase(),
  });

  const foundUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!foundUser) {
    throw new ApiError(500, "Something went wrong while registering a user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, foundUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = await req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required.");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) throw new ApiError(404, "User does not exists.");

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = await req.user._id;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Request");

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) throw new ApiError(404, "Invalid refresh token");

  if (incomingRefreshToken !== user?.refreshToken)
    throw new ApiError(401, "Refresh token is expired or used");

  const options = {
    httpOnly: true,
    secure: true,
  };
  const { accessToken, newRefreshToken } =
    await generateAccessAndRefreshToken();

  return res
    .send(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = await req.body;

  const userId = await req.user._id;

  const user = await User.findById(userId);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been change successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = await req.user?._id;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, { user }));
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email, username} = await req.body; 

    if(!fullName || !email) {
      throw new ApiError(400, "All fields are required")
    }

    const userId = await req.user?._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          email
        }
      }, 
      {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account details updated successfully")
    )

})

const updateUserAvatar = asyncHandler(async(req,res) => {
  const avatarLocalPath = await req.file?.path

  if(!avatarLocalPath) throw new ApiError(400, "Avatar file is missing")

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.secure_url) throw new ApiError(400, "Error while uploading avatar")

    const userId = await req.user._id

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: avatar.secure_url 
        }

      },{new: true}
    ).select("-password -refreshToken")

    return res
    .send(200)
    .json(
      new ApiResponse(200, user, "Avatar updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req,res) => {
  const coverLocalPath = await req.file?.path

  if(!coverLocalPath) throw new ApiError(400, "Cover image file is missing")

    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if(!coverImage.secure_url) throw new ApiError(400, "Error while uploading cover image")

    const userId = await req.user._id

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          coverImage: coverImage.secure_url 
        }

      },{new: true}
    ).select("-password -refreshToken")

    return res
    .send(200)
    .json(
      new ApiResponse(200, user, "Cover image updated successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = await req.params

    if(!username?.trim()) {
      throw new ApiError(400, "Username is missing")
    } 

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase()
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo"
        }
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers"
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo"
          },
          isSubscribed: {
            $cond: {
              if: {$in: [req.user?._id, "$subscribers.subscriber"]},
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1
        }
      }
    ])

    if(!channel?.length) throw new ApiError(404, "Channel does not exists.")

    return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
    
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile
};
