import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Comment} from "../models/comment.models.js"
import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/likes.models.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    // validation's check
    // check video already like 
    // create like video function
    // return res

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const likedAlready = await Like.findOne({
        video : videoId,
        likedBy : req.user?._id,
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id);

        return res
        .status(200)
        .json(new ApiResponse (200, {isLiked : false}))
    }

    await Like.create({
        video : videoId,
        likedBy : req.user?._id
    });

    return res 
    .status(200)
    .json(
        new ApiResponse (200, {isLiked : true})
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id")
    }

    const commentAllready = await Comment.findOne({
        comment : commentId,
        likedBy : req.user?._id,
    })

    if (commentAllready) {
        await Like.findByIdAndDelete(commentAllready?._id)

        return res
        .status(200)
        .json( new ApiResponse (200, {isLiked : false}))
    }

    await Like.create({
        comment : commentId,
        likedBy : req.user?._id,
    })

    return res
    .status(200)
    .json(
        new ApiResponse (200, {isLiked : true})
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
   
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    const TweetAllReady = await Like.findOne({
        tweet : tweetId,
        likedBy : req.user?._id,
    })

    if (TweetAllReady) {
        await Like.findByIdAndDelete(TweetAllReady?._id)

        return res
        .status(200)
        .json (new ApiResponse (200, {likedBy : false}))
    }

    await Like.create({
        tweet : tweetId,
        likedBy : req.user?._id,
    })

    return res
    .status(200)
    .json (new ApiResponse (200, {likedBy : true}))
})

const getLikedVideos = asyncHandler (async (req, res) => {
    // TODO : get all liked videos
  const likedVideosAggegate = await Like.aggregate([
    {
        $match : {
            _id : new mongoose.Types.ObjectId(req.user?._id),
        }
    },
    {
        $lookup : {
            from :"videos",
            localField : "video",
            foreignField : "_id",
            as : "likedVideo",
            pipeline : [
                {
                    $lookup : {
                        from : "users",
                        localField : "owner",
                        foreignField : "_id",
                        as : "ownerDetails",
                    },
                },
                {
                    $unwind : "$ownerDetails",
                }
            ],
        },
    },
    {
        $unwind : "$likedVideo"
    },
    {
        $sort : {
            createdAt : -1,
        }
    },
    {
        $project : {
            _id : 0,
            likedVideo : {
                _id  : 1,
                "videoFile.url" : 1,
                "thumbnail.url" : 1,
                owner : 1,
                title : 1,
                description : 1,
                views : 1,
                duration : 1,
                createdAt : 1,
                isPublished : 1,
                ownerDetails : {
                    username : 1,
                    fullName : 1,
                    "avatar.url" : 1,
                }
            }
        },
    },
  ]);

  return res
  .status (200)
  .json (
    new ApiResponse (
        200, 
        likedVideosAggegate, 
        "Liked videos fetched successfully"
    )
  )
})


export {
    toggleVideoLike, 
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
}