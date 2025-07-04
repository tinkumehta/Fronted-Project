import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js"
import { Video } from "../models/videos.models.js"
import {Comment} from "../models/comment.models.js"
import {Like} from "../models/likes.models.js"
import mongoose, { isValidObjectId } from "mongoose"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler (async (req, res) => {
   const {page =1, limit =10, query, sortBy, sortType, userId} = req.query
   //console.log(userId);
   const pipeline = [];

   if (query) {
      pipeline.push({
         $search : {
            index : "search-videos",
            text : {
               query : query,
               path : ["title", "description"] // search only on title , desc
            }
         }
      });
   }

   if (userId) {{
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
   pipeline.push({$match : {isPublished : true}});

   // sortBy can be views , createdAt , duration
   // sortType can be ascending (-1) or descending (1)

   if (sortBy && sortType) {
      pipeline.push({
         $sort : {
            [sortBy] : sortType === "asc" ? 1 : -1
         }
      });
   } else {
      pipeline.push({ $sort : {createdAt : -1}});
   }

   pipeline.push({
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
      }
   },
   {
      $unwind : "$ownerDetails"
   }
)

const vidoeAggregate = Video.aggregate(pipeline)

const options = {
   page : parseInt (page, 10),
   limit : parseInt (limit , 10)
};

 const video = await Video.aggregatePaginate(vidoeAggregate, options);

 return res 
 .status(200)
 .json(
   new ApiResponse (
      200, video, "Videos fetched successfully"
   )
 )
      
   }
   
})

const publishAVideo = asyncHandler (async (req, res) => {
   const {title, description} = req.body;

   if ([title, description].some((field) => field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
   }

   const videoLocalfilePath = req.files?.videoFile[0].path;
   const thumbnailLocalfilePath = req.files?.thumbnail[0].path;
   
   if (!videoLocalfilePath) {
      throw new ApiError(400, "videoFileLocalPath is required")
   }
   if (!thumbnailLocalfilePath) {
      throw new ApiError(400, "thumbnailLocalfilePath is required")
   }

   const videoFile = await uploadOnCloudinary(videoLocalfilePath);
   const thumbnail = await uploadOnCloudinary(thumbnailLocalfilePath);

    if (!videoFile) {
        throw new ApiError(400, "Video file not found");
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail not found");
    }

   const video  = await Video.create({
      title,
      description,
      duration : videoFile.duration,
      videoFile : {
        // URL : videoFile.url
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

   const vidoeUploaded = await Video.findById(video._id);

   if (!vidoeUploaded) {
      throw new ApiError(400, "videoUpload failed please try again !!!");
   }

   return res
   .status(200)
   .json (
      new ApiResponse(200, video, "Video uploaded successfully")
   )
})

const getVideoById = asyncHandler (async (req, res) => {
   const {videoId} = req.params;

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Video Id")
   }
   if (!isValidObjectId(req.user?._id)) {
      throw new ApiError(400, "Invalid userId");
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
                           if : {$in :[req.user?._id, "$subscribers.subscriber"]},
                           then : true,
                           else : false
                        }
                     }
                  },
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
            }
         }
      },
      {
         $project : {
            "videoFile.url" : 1,
            title : 1,
            description : 1,
            views : 1,
            createdAt : 1,
            duration : 1,
            comments : 1,
            owner : 1,
            likesCount : 1,
            isLiked : 1
         }
      }
   ]);

   if (!video) {
      throw new ApiError(500, "failed to fetch video")
   }

   // increment views 
   await Video.findByIdAndUpdate(videoId, {
      $inc : {
         views : 1
      }
   });

   // add to the watch history
   await User.findByIdAndUpdate(req.user?._id, {
      $addToSet : {
         watchHistory : videoId
      }
   });

   return res
   .status(200)
   .json(
      new ApiResponse (200, video[0], "Video details fetched successfully")
   )

});

const updatedVideo = asyncHandler (async (req, res) => {
   const {title, description} = req.body;
   const {videoId} = req.params;

   if (!(title && description)) {
      throw new ApiError(400, "All field is required")
   }

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId")
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(400, "Not found video")
   }

   if (video?.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(400, "You can't edit this video only owner")
   }

   // delete old video & thumbnail
   const thumbnailToDelete = video.thumbnail.public_id;

   const thumbnailLocalfilePath = req.file?.path;

   if (!thumbnailLocalfilePath) {
      throw new ApiError(400, "thumnail is required")
   }

   const thumbnail = await uploadOnCloudinary(thumbnailLocalfilePath);
   if (!thumbnail) {
      throw new ApiError(500, "thumbnail upload failed")
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         $set : {
            title,
            description,
            thumbnail : {
               url: thumbnail.url,
               public_id : thumbnail.public_id
            }
         }
      },
      {new : true}
   )

   if (!updatedVideo) {
      throw new ApiError(500, "Failed to updated video please try again")
   }
   // TODO : if check the if stament is used to delete old thumbnail
   if (updatedVideo) {
      await deleteOnCloudinary(thumbnailToDelete);
   }

   return res
   .status(200)
   .json(
      new ApiResponse (200, updatedVideo, "Video updated successfully")
   )
})

const deleteVideo = asyncHandler (async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "No video found");
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            400,
            "You can't delete this video as you are not the owner"
        );
    }

    const videoDeleted = await Video.findByIdAndDelete(video?._id);
    if (!videoDeleted) {
      throw new ApiError(400, "Failed to delete")
    }

    await deleteOnCloudinary(video.thumbnail.public_id);
    await deleteOnCloudinary(video.videoFile.public_id, "video");

    // delete video like
    await Like.deleteMany({
      video : videoId,
    })
    // delete video comment
    await Comment.deleteMany({
      video : videoId,
    })

    return res
    .status(200)
    .json(
      new ApiResponse (200, {} ,"Video delete successfully")
    )
})

const togglePublishStatus = asyncHandler (async (req, res) =>{
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "No video found");
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            400,
            "You can't delete this video as you are not the owner"
        );
    }

    const toggledVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         $set : {
            isPublished : !video?.isPublished
         }
      }, 
      {
         new : true
      }
    )

    if (!toggledVideo) {
      throw new ApiError(500, "Failed to toogle video publish status")
    }

    return res
    .status(200)
    .json(
      new ApiResponse (
         200, 
         {isPublished : toggledVideo.isPublished}, 
         "Video publish toggled successfully"
      )
    )
})


export {
   publishAVideo,
   updatedVideo,
   deleteVideo, 
   getAllVideos,
   getVideoById,
   togglePublishStatus
}