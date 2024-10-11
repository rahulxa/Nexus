import Jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import httpStatus from "http-status"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    console.log("this is token:", req.cookies?.accessToken)
    //getting the access token form the req which has cookies cuz of cookie parser middleware
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res
                .status(httpStatus.FORBIDDEN)
                .json({ message: "User not authorized" })
        }

        //verifying the token with the token secret, decoding the token which will contain all the payloads(user data)
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //finding the user with the accesstoken received in the req or header(finding the user with the same access token in the database)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: "Invalid access token" })
        }
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ message: error.message })
    }
});
