import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Duration, RootState } from "@/data";

const initialState: Duration = {
  duration: "2h",
};

const durationSlice = createSlice({
  name: "duration",
  initialState,
  reducers: {
    chaangeDuration: (state, action: PayloadAction<Duration>) => {
      state.duration = action.payload.duration;
    },
  },
});

export const { chaangeDuration } = durationSlice.actions;

export const getDuration = (state: RootState) => state.duration;

export default durationSlice.reducer;
