import mongoose, {isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.mdoels.js"
import {User} from "../models/user.modles.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const createTweet = asyncHandler (async (req, res) => {
    // create tweet
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "content is empty")
    }
    const tweet = await Tweet.create({
        content, 
        owner : req.user?._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create a tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet created successfully")
    )
})

const getUserTweets = asyncHandler (async (req, res) => {
    // get user tweets

    const {userId} = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User id is not valid")
    }

    const tweet = await Tweet.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails",
                pipeline : [
                    {
                        $project : {
                            username :1,
                            "avatar.url" : 1,
                        }
                    }
                ],
            }
        },
        {
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "tweet",
                as : "likeDetails",
                pipeline : [
                    {
                        $project : {
                            likedBy : 1,
                        }
                    },
                ],
            }
        },
        {
            $addFields : {
                likesCount : {
                    $size : "$likeDetails"
                },
                ownerDetails : {
                    $first : "$ownerDetails"
                },
                isLiked : {
                    $cond : {
                        if : {$in : [req.user?._id, "$likeDetails.likedBy"]},
                        then : true,
                        else : false
                    }
                }
            },
        },
        {
            $sort : {
                createdAt : -1
            }
        },
        {
            $project : {
                content : 1,
                ownerDetails : 1, 
                likesCount : 1,
                createdAt : 1,
                isLiked : 1
            },
        },
    ]);

    return res 
    .status(200)
    .json ( 
        new ApiResponse (200, tweet, "Tweets fetched successfully")
    )
})

const updateTweet = asyncHandler (async (req, res) => {
    // update tweet
    const {content} = req.body
    const {tweetId} = req.params

    if (!content) {
        throw new ApiError(400, "Content is missing")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "tweet id is not valid")
    }

    const tweet = await Tweet.findById(tweetId)

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit their tweet")
    }

    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set : {
                content,
            },
        },
        { new : true}
    );

    if (!newTweet) {
        throw new ApiError(500, "Failed to edit tweet please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newTweet, "Tweet updated successfully")
    )

})

const deleteTweet = asyncHandler (async (req, res) => {
    // delete tweet

    const {tweetId} = req.params


    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "tweet id is not valid")
    }

    const tweet = await Tweet.findById(tweetId)

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit their tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json (
        new ApiResponse(200, {tweetId}, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}