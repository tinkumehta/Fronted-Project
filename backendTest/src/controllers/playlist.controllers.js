import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/videos.models.js"
import {Playlist} from "../models/playlist.models.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if (!name || !description) {
        throw new ApiError(400, "required all field")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user?._id,

    })
    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse (201, playlist, "Playlist is created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }
    const playlist = await Playlist.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        }, 
        {
            $lookup : {
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                as : "videos"
            }
        },
        {
            $addFields : {
                totalVideos : {
                    $size : "$videos"
                },
                totalViews : {
                    $sum : "$videos.views"
                }
            }
        },
        {
            $project : {
                _id : 1,
                name : 1,
                description : 1,
                totalVideos : 1,
                totalViews : 1,
                updatedAt : 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse (201, playlist[0], "User playlist fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id")
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match :{
                _id : new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                as : "videos"
            }
        },
        {
            $match : {
                "videos.isPublished" : true
            }
        },
        {
            $lookup : {
                from : "users",
                localField :"owner",
                foreignField : "_id",
                as : "owner"
            }
        }, 
        {
            $addFields : {
                totalVideos : {
                    $size : "$videos"
                },
                totalViews : {
                    $sum : "$videos.views"
                },
                owner : {
                    $first : "$owner"
                }
            }
        },
        {
            $project : {
                name : 1,
                description : 1,
                createdAt : 1,
                updatedAt : 1,
                totalVideos : 1,
                totalViews : 1,
                videos : {
                    _id : 1,
                    "videoFile.url" : 1,
                    "thumbnail.url" : 1,
                    title : 1,
                    description : 1,
                    duration : 1,
                    createdAt : 1,
                    views : 1
                },
                owner : {
                    username  : 1,
                    fullName : 1,
                    "avatar.url" : 1
                }
            }
        }
    ])

    return res
    .status(200)
    .json (new ApiResponse (201, playlistVideos[0], "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist Id & video Id")
    }

    const video = await Video.findById(videoId);
    const playlist = await Playlist.findById(playlistId);

    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if ((playlist?.owner.toString() && video?.owner.toString()) !== req.user?._id.toString()) {
        throw new ApiError(400, "playlist can't be other user")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id, {
            $addToSet : {
                videos : videoId,
            }
        },
        {new : true}
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to add video in playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse (201, updatedPlaylist, "Playlist add to video successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId & videoId")
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }
    if (!video) {
        throw new ApiError(400, "video not found")
    }

    if ((playlist?.owner.toString() && video?.owner.toString()) !== req.user?._id.toString()) {
        throw new ApiError(400, "Only user can remove video")
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull : {
                videos : videoId
            }
        },
        {
            new  : true
        }
    )

    if (!updatePlaylist) {
        throw new ApiError(500, "remove video from playlist is failed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, updatePlaylist, "remove video from playlist is successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

     if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id ")
    }

    const playlist = await Playlist.findById(playlistId);

     if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "playlist can't be delete")
    }

    await Playlist.findByIdAndDelete(playlist?._id)

    return res
    .status(200)
    .json (
        new ApiResponse (
            201, {}, "Playlist is delete successfully"
        )
    )
})

const UpdatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!name || !description) {
        throw new ApiError(400, "required all field")
    }

      if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id ")
    }

    const playlist = await Playlist.findById(playlistId);


     if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "playlist can't be edit by other user")
    }

    const updateplaylis = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $set: {
                name,
                description
            }
        },
        {new : true}
    )

    if (!updateplaylis) {
        throw new ApiError(500, "playlist update is failed ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            updateplaylis,
            "Playlist updated successfully"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    UpdatePlaylist
}