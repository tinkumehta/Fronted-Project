import { Subsciption } from "../models/subscription.mdoles.js"
import { User } from "../models/user.modles.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose, {isValidObjectId} from "mongoose"

const toggleSubscription = asyncHandler (async (req, res) => {
    const {channelId} = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel Id")
    }

    const isSubscribed = await Subsciption.findOne({
        subscriber : req.user?._id,
        channel : channelId
    });

    if (isSubscribed) {
         await Subsciption.findByIdAndDelete(isSubscribed?._id)

         return res
         .status(200)
         .json (
            new ApiResponse(
                200, 
                {subscribed : false},
                "unsubscribed the channel"
            )
         )
    }

    await Subsciption.create({
        subscriber : req.user?._id,
        channel : channelId
    });

    return res
    .status(200)
    .json(
        new ApiResponse (
            200,
            {subscribed : true},
            "subscribed the channel"
        )
    );
});

const getUserChannelSubscribers = asyncHandler (async (req, res) => {
    let {channelId} = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    channelId = new mongoose.Types.ObjectId(channelId);

    const subscribers = await Subsciption.aggregate([
        {
            $match : {
                channel : channelId
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "subscriber",
                foreignField : "_id",
                as : "subscriber",
                pipeline : [
                    {
                        $lookup : {
                            from : "subsciptions",
                            localField : "_id",
                            foreignField : "channel",
                            as : "subscribedToSubscriber"
                        },
                    },
                    {
                        $addFields : {
                            subscribedToSubscriber : {
                                $cond : {
                                    if : {$in : [channelId, "$subscribedToSubscriber.subscriber"]},
                                    then : true,
                                    else : false
                                },
                            },
                            subscribersCount : {
                                $size : "$subscribedToSubscriber"
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind : "$subscriber",
        },
        {
            $project : {
                _id : 0,
                subscriber : {
                    _id : 0,
                    username : 1,
                    fullName : 1,
                    "avatar.url" : 1,
                    subscribedToSubscriber : 1,
                    subscribersCount : 1,
                }
            }
        },
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "subscribers fetched successfully"
        )
    );
})

const getSubscribedChannels = asyncHandler (async (req, res) => {
    const {subscribedId} = req.params;

    if (!isValidObjectId(subscribedId)) {
        throw new ApiError(400, "Invalid id")
    }

    const subscribedChannels = await Subsciption.aggregate([
        {
            $match  : {
                subscriber : new mongoose.Types.ObjectId(subscribedId),
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "channel",
                foreignField : "_id",
                as : "subscribedChannel",
                pipeline : [
                    {
                        $lookup : {
                            from : "videos",
                            localField : "_id",
                            foreignField : "owner",
                            as : "videos"
                        }
                    }, 
                    {
                        $addFields : {
                            latestVideo : {
                                $last : "$videos",
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind : "$subscribedChannel"
        },
        {
            $project : {
                _id : 0,
                subscribedChannel: {
                    _id : 1,
                    username : 1,
                    fullName : 1,
                    "avatar.url" : 1,
                    latestVideo : {
                        _id : 1,
                        "videoFile.url" : 1,
                        "thumbnail.url" : 1,
                        owner : 1,
                        title : 1,
                        description : 1,
                        duration : 1,
                        createdAt : 1,
                        views : 1
                    },
                },
            },
        },
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribedChannels,
            "subscribe channels fetched successfully"
        )
    );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}