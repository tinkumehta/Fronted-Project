import {User} from "../models/User.models.js"

import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'

const register = asyncHandler (async (req, res) => {
    const {name, email, username, password, role} = req.body;
    // check all field give fronted
    // user already exits
    // hash password
    
    if ([name, email,username, password, role].some((index) => index?.trim() === "")) {
        throw new ApiError(400, "All field's is required")
    }

    const existingUser = await User.findOne({
        $or : [{email}, {username}]
    });

    if (existingUser) {
        throw new ApiError(400, "User is already exits")
    }

    const user = await User.create({
        name,
        email, 
        username,
        password,
        role
    })

    const createUser = await User.findById(user?._id).select("-password")
    if (!createUser) {
        throw new ApiError(500, "created user is falied")
    }

    return res
    .status(201)
    .json(
        new ApiResponse (201, createUser, "User register is successfully")
    )

})

 const login = asyncHandler(async (req, res) => {
    const {email, password, username} = req.body

    if (! (email || username)) {
        throw new ApiError(400, "email and password is required")
    }

    const user = await User.findOne({
        $or : [{username}, {email}]
    });
    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const isMatch = await user.isPasswordCorrect(password)

    if (!isMatch) {
        throw new ApiError(400, "Password is not correcty")
    }

    const createdUser = await User.findById(user?._id).select("-password")
    if (!createdUser) {
        throw new ApiError(500, "user login is falied")
    }
    const token = jwt.sign(
        {
        _id : user._id,
    },
    process.env.JWT_SECRET,
    {
        expiresIn : '1d'
    }
    )

    return res
    .status(201)
    .json(
        new ApiResponse (201, {token, createdUser}, "user login is successfully")
    )
 })

 

 export {
    register,
    login
 }