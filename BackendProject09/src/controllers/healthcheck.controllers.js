import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const helathcheck = asyncHandler (async (req, res) => {
    // build a healthcheck response that simply returns
    return res
    .status(200)
    .json(
        new ApiResponse (200, {message : "Everything is OK"}, "Ok")
    )
})

export {
    helathcheck
}