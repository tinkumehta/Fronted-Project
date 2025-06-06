import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { OPTIONS } from "../constants.js"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating accessToken and refreshToken")
    }
}

const register = asyncHandler (async (req, res) => {
    // get all user details for fronted
    // validation - not empty
    // check user already register
    // check image and avatar 
    // upload them to cloudinary , avatar
    // create user object - create entery in db
    // check user creation 
    // return res

    const {username, email, password,  fullName} = req.body

    if (
        [username, email, password, fullName].some((field) => field?.trim() === "")
    ) {
        throw new  ApiError(401, "All field are required")
    }

    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User is allready exits")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(401, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500, "Failed to upload")
    }

    const user = await User.create({
        fullName,
        username : username.toLowerCase(),
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage.url || "",
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong for register user")
    }

   
   return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> username, email, password
    // find the user
    // check password
    // access and referesh token
    // send cookie

    const {email, username, password} = req.body

    if(! (email || username)){
        throw new ApiError(401, "email and username is required")
    }

    const user  = await User.findOne({
        $or : [{email}, {username}]
    })

    if (!user) {
        throw new ApiError(400, "User does'nt exits")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "User password is not correcty")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, OPTIONS)
    .cookie("refreshToken", refreshToken, OPTIONS)
    .json(
        new ApiResponse(
            200, 
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User logged In successfully"
        )
    )
})