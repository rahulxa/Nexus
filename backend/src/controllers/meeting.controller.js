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
        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "User with this username does not exist" });
        }
        //saving the meeting for each user
        const newMeeting = {
            meetingId: createdMeetingId,
        }

        existingUser.meetingHistory.push(newMeeting);

        const savedMeetingId = await existingUser.save();

        if (!savedMeetingId) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "An unexpected error occourred" })
        }


        //saving created meeting id in the database
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
    const { meetingId, username } = req.body;

    if (!meetingId && !username) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Meeting id and username is required" })
    }

    try {
        const existingMeetingId = await Meeting.findOne({ meetingCode: meetingId });

        if (!existingMeetingId) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "Meeting id invalid" })
        }

        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "User with this username does not exist" });
        }
        //saving the meetingid for user
        const newMeeting = {
            meetingId: existingMeetingId,
        }

        existingUser.meetingHistory.push(newMeeting);

        const savedMeetingId = await existingUser.save();

        if (!savedMeetingId) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "An unexpected error occourred" })
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


export { createNewMeeting, joinExistingMeeting, removeMeetingId }