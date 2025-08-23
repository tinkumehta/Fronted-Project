import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { OPTIONS } from "../constants.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


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
        throw new ApiError(400, "User is allready exits")
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
        coverImage : coverImage?.url || "",
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

    if(! (email) && ! (username)){
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

const logout = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1 // this is remove the field from document
            }
        },
        {
            new : true
        }
    )


    return res
    .status(200)
    .clearCookie("accessToken", OPTIONS)
    .clearCookie("refreshToken", OPTIONS)
    .json(
        new ApiResponse (
            200,
            {},
            "User logout successfully"
        )
    )
})

const refreshAccessToken = asyncHandler (async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodeToken?._id)

         if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired ")
    }

    const {accessToken, newRefreshToken}  = await generateAccessAndRefreshTokens()

    return res
    .status(200)
    .cookie("accessToken",accessToken ,OPTIONS)
    .cookie("refreshToken",newRefreshToken ,OPTIONS)
    .json(
        new ApiResponse(
            201, 
            {accessToken, refreshToken : newRefreshToken},
            "Access token refreshToken"
        )
    )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changePassword = asyncHandler (async (req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    

     if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(201)
    .json(
        new ApiResponse (201, {}, "Password changed successfully")
    )
})

const getCurrentUser = asyncHandler (async (req, res) => {
    return res
    .status(201)
    .json(
        new ApiResponse(200, req.user, "User fetched successfully")
    )
})

const updateAccountDetails = asyncHandler (async (req, res) => {
    const {email, fullName} = req.body

    if (!email || !fullName) {
        throw new ApiError(401, "All field are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName,
                email : email
            }
        },
        { new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user,  "Account details updated successfully")
    )
})

const updateUserAvatar = asyncHandler (async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // TODO : delete old image - assignment
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(401, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateCoverImage = asyncHandler (async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        new ApiError(400, "Cover image file is missing")
    }

    // TODO : delete old image - assignment

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image update successfully")
    )
})

const getUserChannelProfile = asyncHandler (async (req, res) => {
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(401, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match : {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields : {
                subscribersCount : {
                    $size : "$subscribers"
                },
                channelsSubscribedToCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed : {
                    $cond : {
                        if : {$in : [req.user?._id, "$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                fullName : 1,
                username : 1,
                email : 1,
                subscribersCount : 1,
                channelsSubscribedToCount : 1,
                isSubscribed : 1,
                avatar : 1, 
                coverImage : 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exits")
    }

    return res
    .status(200)
    .json(
        new ApiResponse (200, channel[0], "User channel fetched successfully")
    )
})

const getWatchHistory = asyncHandler (async (req, res) => {
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistroy",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        fullName : 1,
                                        username : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                owner : {
                    $first : "$owner"
                }
            }
        }
    ])

    return res
    .status(201)
    .json (
        new ApiResponse(
            201, 
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

const followUser = asyncHandler(async (req, res) => {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === targetUserId) {
    throw new ApiError(400, "target id is same")
  }
   const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
     throw new ApiError(404, "User not found")
  }

  // already following
  if (currentUser.following.includes(targetUserId)) {
    throw new ApiError(400, "Already following");
  }

  currentUser.following.push(targetUserId);
  targetUser.followers.push(currentUserId);

  await currentUser.save();
  await targetUser.save();

  return res
  .status(201)
  .json(
    new ApiResponse (201, {}, "followed successfully")
  )
})

 const unfollowUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    throw new ApiError(404, "User not found")
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await targetUser.save();

  return res
  .status(201)
  .json(
    new ApiResponse(201,{}, "Unfollowed successfully")
  )
});

 const getFollowersFollowing = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const userData = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "followers",
                foreignField : "_id",
                as : "followersData"
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "following",
                foreignField : "_id",
                as : "followingData"
            }
        },
        {
            $project : {
                _id : 1,
                followersCount : {
                    $size : "$followersData"
                },
                followingCount : {
                    $size : "$followingData"
                },
                followers : {
                    $map : {
                        input :"$followersData",
                        as : "f",
                        in : {
                            _id : "$$f._id",
                            username : "$$f.username",
                            avatar : "$$f.avatar"
                        }
                    }
                },
                following : {
                    $map : {
                        input : "$followingData",
                        as : "f",
                        in : {
                            _id : "$$f._id",
                            username : "$$f.username",
                            avatar : "$$f.avatar"
                        }
                    }
                },
            }
        },
    ])

    if (!userData ) {
        throw new ApiError(404, "User not found")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, userData[0], "Fetched followers and following ")
    )
});

const searchUser = asyncHandler (async (req, res) => {
    const {query} = req.query;

    if (!query) {
        throw new ApiError(400, "Search query is required")
    }

    const users = await User.find({
        username : {$regex: query, $options : "i"} // case-insenstive
    }).select("username avatar")

    return res
    .status(201)
    .json(
        new ApiResponse(201, users, "Users found successfully")
    )
})

const suggestionUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
        throw new ApiError(404, "User not found")
    }

    const excludedUserIds = [...currentUser.following, currentUserId];

    const suggestion = await User.find({
        _id: {$nin : excludedUserIds}
    }).select("username avatar").limit(4);

    return res.status(200).json(
    new ApiResponse(200, suggestion, "Suggested users fetched")
  );
})

export   {
register,
loginUser,
logout,
getCurrentUser,
refreshAccessToken,
changePassword, 
updateAccountDetails,
updateUserAvatar,
updateCoverImage,
getUserChannelProfile,
getWatchHistory,
followUser,
unfollowUser,
getFollowersFollowing,
searchUser,
suggestionUser,
}