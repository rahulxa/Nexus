import { Router } from "express";
import { createNewMeeting, joinExistingMeeting, removeMeetingId } from "../controllers/meeting.controller.js";


const meetingRouter = Router();

meetingRouter.route("/create-meeting").post(createNewMeeting);
meetingRouter.route("/join-meeting").post(joinExistingMeeting);
meetingRouter.route("/remove-meeting").delete(removeMeetingId);

export default meetingRouter;

