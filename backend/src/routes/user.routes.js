import { Router } from "express";
import {
    generateNewAccessToken,
    loginUser, logoutUser, registerUser,
    getUserMeetingIdHistory
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/register").post(registerUser)
userRouter.route("/get-tokens").post(generateNewAccessToken)
userRouter.route("/get-meeting-history").get(getUserMeetingIdHistory)
userRouter.route("/add-to-activity")
userRouter.route("/get-all-activity")

export default userRouter;

