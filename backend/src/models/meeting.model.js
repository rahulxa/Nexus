import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    meetingCode: { 
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});


export const Meeting = mongoose.model("Meeting", meetingSchema)