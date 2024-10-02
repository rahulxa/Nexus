import { Router } from "express";
import { createNewMeeting, joinExistingMeeting, removeMeetingId, getMeetingHistory } from "../controllers/meeting.controller.js";


const meetingRouter = Router();

meetingRouter.route("/create-meeting").post(createNewMeeting);
meetingRouter.route("/join-meeting").post(joinExistingMeeting);
meetingRouter.route("/remove-meeting").delete(removeMeetingId);
meetingRouter.route("/get-meeting-history").get(getMeetingHistory);

export default meetingRouter;

