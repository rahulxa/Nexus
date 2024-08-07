import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import httpStatus from "http-status"


const resgisterUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([, email, password, username].some((feild) => { return feild?.trim() == "" })) {
        throw new ApiError(400, "All feilds are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return res
            .status(httpStatus.FOUND)
            .json({ message: "User already exists" })
    }

    const user = await User.create({
        username,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password,-refreshToken");

    if (!createdUser) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ messsage: "Something went wrong while creating the user" })
    }

    return res
        .status(httpStatus.CREATED)
        .json({ message: "User registered Successfully" })
});


export { resgisterUser }