import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {Like} from "../models/likes.models.js"
import {Video} from "../models/videos.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "Video not found")
    }

    const commentsAggregate = Comment.aggregate([
        {
            $match : {
                video : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup :{
                from : "users",
                localField : "owner",
                foreignField : "_id",
                 as : "owner"
            }
        },
        {
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "comment",
                as : "likes"
            }
        },
        {
            $addFields : {
                likesCount : {
                    $size : "$likes"
                },
                owner : {
                    $first : "$owner"
                },
                isLiked : {
                    $cond : {
                        if : {$in : [req.user?._id, "$likes.likedBy"]},
                        then : true,
                        else : false
                    }
                },
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        },
        {
            $project : {
                content : 1,
                createdAt : 1,
                likesCount : 1,
                owner : {
                    username : 1,
                    fullName : 1,
                    "avatar.url" : 1
                },
                isLiked : 1
            }
        }
    ]);

    const options = {
        page : parseInt(page, 10),
        limit : parseInt(limit, 10)
    }

    const comments = await Comment.aggregatePaginate(
        commentsAggregate,
        options
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
   const {videoId} = req.params
   const {content} = req.body

   if (!content) {
    throw new ApiError(400, "Content is empty")
   }

   const video = await Video.findById(videoId);
   if (!video) {
    throw new ApiError(400, "Video not found")
   }

   const comment = await Comment.create({
    content,
    video: videoId,
    owner : req.user?._id,
   })

   if (!comment) {
    throw new ApiError(500, "Comment is falied")
   }

   return res
   .status(200)
   .json(
    new ApiResponse (201, comment, "Comment added  is successfully")
   )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentId} = req.params

     if (!content) {
    throw new ApiError(400, "Content is empty")
   }

   const comment = await Comment.findById(commentId);
   if (!comment) {
    throw new ApiError(400, "Comment is not found")
   }

   if (comment?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Only user can edit ' ")
   }

   const newComment = await Comment.findByIdAndUpdate(
    comment?._id, {
        $set : {
            content,
        }
    },
    {new : true}
   )

   if (!newComment) {
    throw new ApiError(500, "Failed to the update comment")
   }
   return res
   .status(200)
   .json(
    new ApiResponse (201, newComment, "Update comment successfully")
   )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

   const comment = await Comment.findById(commentId);
   if (!comment) {
    throw new ApiError(400, "Comment is not found")
   }

   if (comment?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Only user can edit ' ")
   }

   await Comment.findByIdAndDelete(commentId)

   await Like.deleteMany({
    comment : commentId,
    likedBy : req.user
   })

   return res
   .status(200)
   .json(
    new ApiResponse (200, {}, "Delete comment successfully")
   )
})


export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}