import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'
import {Provider} from "../models/Provider.models.js"

const createProvider = asyncHandler(async (req, res) => {
    const {name, category, contact, location, description} = req.body;
    // check all field is not empty
    // create your provider
    
    if (
        [name, category, contact, location, description].some((idx) => idx.trim() === "")
    ) {
        throw new ApiError(400, "All field is required")
    }

    const provider = await Provider.create({
        name,
        category,
        contact,
        location,
        description
    })

    if (!provider) {
        throw new ApiError(500, "Provider create is failed")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, provider, "Provider created is successfully")
    )
})

const getAllProviders = asyncHandler (async (req, res) => {
    const provider = await Provider.find();
    return res
    .status(201)
    .json(
        new ApiResponse (201, provider, "get Provider")
    )
})

const searchProviders = asyncHandler(async (req, res) =>{
    const {category} = req.query;

    if (!category) {
        throw new ApiError(500, "enter your search category")
    }

    const provider = await Provider.find({
        category : new RegExp(category, 'i')
    })

    if (!provider) {
        throw new ApiError(500, "Failed to search")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, provider, "search index is successfully")
    )
})

export {
    createProvider,
    getAllProviders,
    searchProviders
}