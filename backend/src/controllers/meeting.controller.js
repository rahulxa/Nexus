import { asyncHandler } from "../utils/asyncHandler.js";
import httpStatus from "http-status"
import { Meeting } from "../models/meeting.model.js";
import { nanoid } from "nanoid"
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js"


const createNewMeeting = asyncHandler(async (req, res) => {

    const createdMeetingId = nanoid(10);
    const { username } = req.body;

    if (!username) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Username is required" })
    }

    try {
        const meetingId = await Meeting.create({
            meetingCode: createdMeetingId,
            username: username
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



const removeMeetingId = asyncHandler(async (req, res) => {
    const { meetingId } = req.body;

    if (!meetingId) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Meeting id is required" })
    }

    try {
        const deletedMeetingId = await Meeting.findOneAndDelete({ meetingCode: meetingId });

        if (!deletedMeetingId) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: "Invalid meeting id" })
        }
        return res
            .status(httpStatus.OK)
            .json({ message: "Meeting id deleted successfully" })

    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "An unexpected error occourred" })
    }
});


const getMeetingHistory = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Username is required" })
    }
    try {
        const existingUser = await User.findOne({ username: username });

        if (!existingUser) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "User with this username does not exists" })
        }

        const meetingHistory = await Meeting.find({ username: existingUser._id });

        if (meetingHistory.length === 0) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "No previous meetings found" });
        }

        return res
            .status(httpStatus.OK)
            .json(new ApiResponse(meetingHistory, "Meeting history found succesfully"))

    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "An unexpected error occoured" });
    }
});

export { createNewMeeting, joinExistingMeeting, removeMeetingId, getMeetingHistory }