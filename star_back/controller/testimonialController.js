import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'
import {Testimonial} from "../models/Testimonial.models.js"

const createTestimonial = asyncHandler (async (req, res) => {
    const {providerId, message} = req.body;

    if (!message) {
        throw new ApiError(400, "message feild is empty")
    }

    const testimonial = await Testimonial.create({
        user : req.user._id,
        provider : providerId,
        message
    });
    if (!testimonial) {
        throw new ApiError(500, "testimonial is failed")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, testimonial, "Testimonial is successfully")
    )
})

const getTestimonials = asyncHandler (async (req, res) => {

    const testimonial = await Testimonial.find().populate('user', '-password -email').populate('provider');



    return res
    .status(201)
    .json(
        new ApiResponse(201, testimonial, "get testimonial :")
    )
})

export {
    createTestimonial,
    getTestimonials,
    
}