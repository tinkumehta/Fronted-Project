import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'
import {Reviews} from "../models/Review.models.js"
import { isValidObjectId } from 'mongoose'

const createReview = asyncHandler (async (req, res) => {
    const {providerId, rating, comment} = req.body;

    if (!isValidObjectId(providerId)) {
        throw new ApiError(400, "Invalid provider Id")
    }
    if (! (rating || comment)) {
        throw new ApiError(400, "All field is required")
    }
    
    const review = await Reviews.create({
        user : req.user._id,
        provider : providerId,
        rating,
        comment
    });

    if (!review) {
        throw new ApiError(500, "Failed to review")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201, review, "review is successfully")
    )
})

const getReviewsByProvider = asyncHandler(async (req, res) => {
    const {providerId} = req.params;

    if (!isValidObjectId(providerId)) {
        throw new ApiError(400, "Provider id is empty")
    }
    const reviews = await Reviews.find({
        provider : providerId
    }).populate('user', '-password -email').populate('provider');

    if (!reviews) {
        throw new ApiError(500, "Failed to get reviews")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, reviews, "get reviews is successfully")
    )
})

export {createReview, getReviewsByProvider}