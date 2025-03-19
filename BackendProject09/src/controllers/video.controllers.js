import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.modles.js"
import { Video } from "../models/video.modles.js"
import mongoose, {isValidObjectId} from "mongoose"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"
import { text } from "express"
import { url } from "inspector"


const getAllVideos = asyncHandler(async (req, res) => {
    const {page =1, limit = 10, query, sortBy, sortType, userId} = req.query
    // get all videos based on query on query, sort, pagination
    console.log(userId);
    const pipeline = [];

    // for using full text based search u need to create a search index in mongoDB atlas
    // you can include field mappings in search index eg. title, description, as well
    // Field mappings specify which fields within your documents should be indexed for text search.
    // this helps in searching only in title, desc providing faster search results
    // here the name of search index is 'search-videos

    if (query) {
        pipeline.push({
            $search : {
                index : "search-videos",
                text : {
                    query : query,
                    path : ["title", "description"] // search only on title, desc
                }
            }
        });
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        pipeline.push({
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        });
    }
    

    // fetch videos only that are set isPublished as true
    pipeline.push({ $match : {isPublished : true}});

    // sortBy can be views, createdAt, duration
    // sortType can be ascending or descendig 
    if (sortBy && sortType) {
        pipeline.push({
            $sort : {
                [sortBy] : sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({$sort : {createdAt : -1}});
    }

    pipeline.push(
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails",
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            "avatar.url" : 1
                        }
                    }
                ]
            },
        },
        {
            $unwind : "$ownerDetails"
        }
    )

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page : parseInt(page, 10),
        limit : parseInt(limit , 10)
    };

    const video = await Video.aggregatePaginate(videoAggregate, options)

    return res
    .status(200)
    .json (new ApiResponse (200, video, "Videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const {title, description} = req.body
    // get video, upload to cloudinary, create video
    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "video file path is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail path is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new ApiError(400, "video file is not found")
    }

    if (!thumbnail) {
        throw new ApiError(400, "thumbnail path is not found")
    }

    const video = await Video.create({
        title,
        description,
        duration : videoFile.duration,
        videoFile : {
            url : videoFile.url,
            public_id : videoFile.public_id
        },
        thumbnail : {
            url : thumbnail.url,
            public_id : thumbnail.public_id
        },
        owner : req.user?._id,
        isPublished : false
    });

    const videoUploaded = await Video.findById(video._id);

    if (!videoUploaded) {
        throw new ApiError(500, "videoUpload failed please try again !!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
   const {videoId} = req.params
   // let userId = req.body;

   if (!isValidObjectId(videoId)) {
    throw new ApiError(500, "Invalid videoId");
   }

   if (!isValidObjectId(req.user?._id)) {
    throw new ApiError(500, "Invalid videoId");
   }

   const video = await Video.aggregate([
    {
        $match : {
            _id : new mongoose.Types.ObjectId(videoId)
        }
    },
    {
        $lookup : {
            from : "likes",
            localField : "_id",
            foreignField : "video",
            as : "likes"
        }
    },
    {
        $lookup : {
            from : "users",
            localField : "owner",
            foreignField : "_id",
            as : "owner",
            pipeline : [
                {
                    $lookup : {
                        from : "subscriptions",
                        localField : "_id",
                        foreignField : "channel",
                        as : "subscribers"
                    }
                },
                {
                    $addFields : {
                        subscribersCount : {
                            $size : "$subscribers"
                        },
                        isSubscribed : {
                            $cond : {
                                if : { $in :[req.user?._id, "$subscribers.subscriber"]},
                                then : true,
                                else : false
                            }
                        }
                    }
                },
                {
                    $project : {
                        username : 1,
                        "avatar.url" : 1,
                        subscribersCount : 1,
                        isSubscribed : 1
                    }
                }
            ]
        },
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
            }
        }
    },
    {
        $project : {
            "videoFile.url" : 1,
            title : 1,
            description : 1,
            view : 1,
            createdAt : 1,
            duration : 1,
            Comments : 1,
            owner : 1,
            likesCount : 1,
            isLiked : 1
        }
    }
   ]);

   if (!video) {
    throw new ApiError(500, "failed to fetch video");
   }

   // increment views if video fetched successfully
   await Video.findByIdAndUpdate(videoId, {
    $inc : {
        views : 1
    }
   });

   // add this video to user watch history
   await User.findByIdAndUpdate(req.user?._id, {
    $addToSet : {
        watchHistory : videoId
    }
   });

   return res
   .status(200)
   .json(
        new ApiResponse(200, video[0], "video details fetched successfully")
   )
})


const updateVideo = asyncHandler(async (req, res) => {
   const {videoId} = req.params
   const {title, description} = req.body;
   // update video details like title , description, thumbnail


   if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
   }
   if (! (title && description)) {
     throw new ApiError(400, "title and description are required")
   }

   const video = await Video.findById(videoId);

   if (!video) {
    throw new ApiError(404, "No video found");
   }

   if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You can't edit this video as you are not the owner")
   }

   // delete old thumbnail and updating with new one
   const thumbnailToDelete = video.thumbnail.public_id;

   const thumbnailLocalPath = req.file?.path;

   if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is required")
   }

   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

   if (!thumbnail) {
    throw new ApiError(400, "thumbnail is not found")
   }

   const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
        $set : {
            title,
            description,
            thumbnail : {
                public_id : thumbnail.public_id,
                url : thumbnail.url
            }
        }
    }, 
    { new : true}
   );

   if (!updateVideo) {
    throw new ApiError(500, "Failed to update video please try again")
   }

   if (updateVideo) {
    await deleteOnCloudinary(thumbnailToDelete)
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200, updateVideo, "Video updated successfully")
   )
})

const deleteVideo = asyncHandler(async (req, res) => {
   const {videoId} = req.params

   if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id")
}

const video = await Video.findById(videoId);

if (!video) {
throw new ApiError(404, "No video found");
}

if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "You can't delet this video as you are not the owner")
}

    const videoDeleted = await Video.findByIdAndDelete(video?._id);

    if (!videoDeleted) {
        throw new ApiError(400, "Failed to delete the video")
       }
    
       await deleteOnCloudinary(video.thumbnail.public_id);
       await deleteOnCloudinary(video.videoFile.public_id, "video");

       // delete video likes
       await Like.deleteMany({
         video : videoId
       })

       // delete video comments
       await Comment.deleteMany({
        video : videoId,
       })

       return res
       .status(200)
       .json (
        new ApiResponse(200, {}, "Video deleted successfully")
       )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
   const {videoId} = req.params

   if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id")
}

const video = await Video.findById(videoId);

if (!video) {
throw new ApiError(404, "No video found");
}

if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "You can't toogle publish this video as you are not the owner")
}

    const toggledVideoPublish = await Video.findByIdAndUpdate(
        videoId,
        {
            $set : {
                isPublished : !video?.isPublished
            }
        },
        { new : true}
    );

    if (!toggledVideoPublish) {
        throw new ApiError(500, "Failed to toogle video publish status")
    }

    return res
    .status(200)
    .json (
        new ApiResponse(
            200,
            {isPublished : toggledVideoPublish.isPublished},
            "Video publish toggled successfully"
        )
    )

})

export {
    getAllVideos,
    getVideoById,
    publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}