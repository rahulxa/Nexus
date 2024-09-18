import { asyncHandler } from "../utils/asyncHandler";
import httpStatus from "http-status"
import { Meeting } from "../models/meeting.model";
import { nanoid } from "nanoid"


const createNewMeeting = asyncHandler(async (req, res) => {
    const createdMeetingId = nanoid(10);
    try {
        const meetingId = await Meeting.create({
            createdMeetingId
        });

        const createdMeeting = await Meeting.findById(meetingId._id);
        if (!createdMeeting) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Something went wrong while creating the meeting id" })
        }

        return res
            .status(httpStatus.CREATED)
            .json(new ApiResponse(createdMeeting, "Meeting id created successfully"));

    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "An unexpected error occoured" });
    }
});


const joinExistingMeeting = asyncHandler(async (req, res) => {
    
})