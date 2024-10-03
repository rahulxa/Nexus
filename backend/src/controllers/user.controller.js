import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import httpStatus from "http-status"
import Jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

const generateAccessAndRefreshTokens = async (userid) => {
    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }); //only saving the newly created refresh token to the database and not others

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([email, password, username].some((field) => field?.trim() === "")) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res
                .status(httpStatus.CONFLICT)
                .json({ message: "User with this username or email already exists, if you already have an account please login to continue!" });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Something went wrong while registering the user. Please try again" });
        }

        return res
            .status(httpStatus.CREATED)
            .json(new ApiResponse(createdUser, "Account created successfully.Please login to continue"));

    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "An unexpected error occoured" });
    }
});



const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    if (!username && !password) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Username and password is required" })
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "User with this username does not exists." })
        }
        const checkPassword = await user.isPasswordCorrect(password);

        if (!checkPassword) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ message: "Wrong Password!" })
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password")
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(httpStatus.OK)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(loggedInUser, "User logged in successfully"));
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "An unexpected error occurred" });
    }
});



const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json(new ApiError("User Not authenticated"))
    }

    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } }, //and remove this field
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(httpStatus.OK)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse("User logged out Sucessfully"))
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(new ApiError(error, "An unexpected error occurred"));
    }
});


const generateNewAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json("Unauthorized Request")
    }

    try {
        const verifyToken = Jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(verifyToken._id).select("-password")
        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json("User not found")
        }

        if (user?.refreshToken !== incomingRefreshToken) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json("User not authorized")
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(httpStatus.OK)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse({ user: accessToken, refreshToken }, "New tokens generated successfully"))
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(new ApiError(error, "An unexpected error occurred"));
    }
})


export { registerUser, loginUser, logoutUser, generateNewAccessToken }