import { Router } from "express";
import { createNewMeeting, joinExistingMeeting } from "../controllers/meeting.controller.js";


const meetingRouter = Router();

meetingRouter.route("/create-meeting").post(createNewMeeting)
meetingRouter.route("/join-meeting").post(joinExistingMeeting)

export default meetingRouter;

