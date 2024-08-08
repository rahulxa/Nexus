import { Router } from "express";
import {
    generateAccessAndRefreshTokens,
    loginUser, logoutUser, registerUser
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(logoutUser)
userRouter.route("/register").post(registerUser)
userRouter.route("/get-tokens").post(generateAccessAndRefreshTokens)
userRouter.route("/add-to-activity")
userRouter.route("/get-all-activity")

export default userRouter;

