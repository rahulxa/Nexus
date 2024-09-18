import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    meetingId: ""
}

const meetingIdSlice = createSlice({
    name: "createdMeetingId",
    initialState,
    reducers: {
        setMeetingId: (state, action) => {
            state.meetingId = action.payload.meetingId
        },
        clearMeetingId: (state, action) => {
            state.meetingId = ""
        }
    }
});


export const { setMeetingId, clearMeetingId } = meetingIdSlice.actions;

export const meetingIdReducer = meetingIdSlice.reducer;

