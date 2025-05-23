import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from '../models/playlist.models.js'
import {Video} from '../models/video.modles.js'


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    // create playlist
    // check valids
    // create playlist
    // return res

    if (!name || !description) {
        throw new ApiError(400, "name and description both are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user?._id,
    });

    if (!playlist) {
        throw new ApiError(500, "failed to create playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "playlist created successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const {playlistId} = req.params;

    // check validition
    // find by id
    // update playlist 
    // return res

    if (!name || !description) {
        throw new ApiError(400, "name and description both are required")
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "play list id not valid")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit the playlist")
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $set : {
                name,
                description,
            },
        },
        { new : true}
    );

    return res
    .status(200)
    .json (
        new ApiResponse(
            200, 
            updatePlaylist,
            "Update playlist successfully"
        )
    )
    
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    // check valided
    // find by id
    // check id is ok
    // add to playlist
    // return res
    
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist id and video id")
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!video) {
        throw new ApiError(404, "Video is not found")
    }
    if(
        (playlist.owner?.toString() && video.owner?.toString()) 
        !== res.user?._id.toString()
    ){
        throw new ApiError(400, "only owner can add video to thier")
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $addToSet : {
                videos : videoId
            }
        },
        {new : true}
    );

    if (!updatePlaylist) {
        throw new ApiError(400, "failed to add playlist please try again")
    }

    return res
    .status(200)
    .json (
        new ApiResponse(
            200, 
            updatePlaylist, 
            "Added the video in playlist successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;

    // check validition
    // find by id
    // delete playlist 
    // return res

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "play list id not valid")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit the playlist")
    }

    await Playlist.findByIdAndDelete(playlist?._id)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Playlist delete successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler (async (req, res) => {
    const {playlistId, videoId} = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist id and video id")
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!video) {
        throw new ApiError(404, "Video is not found")
    }
    if(
        (playlist.owner?.toString() && video.owner?.toString()) 
        !== res.user?._id.toString()
    ){
        throw new ApiError(400, "only owner can add video to thier")
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $pull: {
                videos : videoId,
            }
        },
        { new : true}
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatePlaylist,
            "Removed video from playlist successfully"
        )
    );

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist is not found")
    }
    const playlistVideos = await Playlist.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(playlist)
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
                localField : "owner",
                foreignField : "_id",
                as : "owner"
            }
        },
        {
            $addFields : {
                totalVideos :{
                    $size : "$videos"
                },
                totalViews : {
                    $sum : "$videos.views"
                },
                owner :{
                    $first : "$owner"
                }
            }
        },
        {
            $project : {
                name : 1,
                description : 1, 
                createdAt : 1,
                updateAt : 1,
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
                    username : 1,
                    fullName : 1,
                    "avatar.url" : 1
                }
            }
        }
    ]);

    return res
    .status(200)
    .json (
        new ApiResponse(
            200, 
            playlistVideos[0],
             "playlist fetched successfully"
            )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.aggregate([
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
                description: 1,
                totalVideos : 1,
                totalViews : 1,
                updateAt : 1
            }
        }
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse (
            200,
            playlists,
            "User playlist fetched successfully"
        )
    )
})

export {
    createPlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
    getPlaylistById,
    getUserPlaylists,
    
}