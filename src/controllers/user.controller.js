import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req,res) => {
    // destructre data that comes from user
    // check if that user exists in the database by thier email or username
    // return client error : User already exists. please log in
    // if user does not exists in the database, save data in database
    // generate token and store in the database
    // return success message

    const {email, username, fullName, password} = await req.body

    if(email === "" || username === "" || fullName === "" || password === "") {
        throw new ApiError(400, "All fields are required.");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists.")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    console.log("Response from req.files : \n",req.files);

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required.")
    }

    const user = await User.create({
        fullName,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        username: username.toLowerCase()
    })

    const foundUser = await User.findById(user._id).select("-password -refreshToken")
        
    if(!foundUser) {
        throw new ApiError(500, "Something went wrong while registering a user.")
    }

    return res.status(201).json(
        new ApiResponse(201, foundUser, "User registered successfully.")
    )
    
})


export {
    registerUser
}