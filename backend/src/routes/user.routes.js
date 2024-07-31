import { Router } from "express";

const userRouter = Router();

userRouter.route("/login")
userRouter.route("/register")
userRouter.route("/add-to-activity")
userRouter.route("/get-all-activity")

export default userRouter;

