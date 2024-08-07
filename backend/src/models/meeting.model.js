import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    meetingCode: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});


export const Meeting = mongoose.model("Meeting", meetingSchema)