import { asyncHandler } from "../utils/asyncHandler.js";
import httpStatus from "http-status"
import { Meeting } from "../models/meeting.model.js";
import { nanoid } from "nanoid"
import { ApiResponse } from "../utils/apiResponse.js";


const createNewMeeting = asyncHandler(async (req, res) => {
    const createdMeetingId = nanoid(10);
    try {
        const meetingId = await Meeting.create({
            meetingCode: createdMeetingId,
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
    console.log("Request received:", req.body);
    const { meetingId } = req.body;

    if (!meetingId) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Meeting id is required" })
    }

    try {
        const existingMeetingId = await Meeting.findOne({ meetingCode: meetingId });

        if (!existingMeetingId) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "Meeting id invalid" })
        }

        return res
            .status(httpStatus.OK)
            .json(new ApiResponse(existingMeetingId, "Meeting id found successfully"))

    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "An unexpected error occourred" })
    }
});


export { createNewMeeting, joinExistingMeeting }