import { configureStore } from "@reduxjs/toolkit";
import { meetingIdReducer } from "./MeetingSlice";

const store = configureStore({
    reducer: {
        createdMeetingId: meetingIdReducer
    }
});

export default store;