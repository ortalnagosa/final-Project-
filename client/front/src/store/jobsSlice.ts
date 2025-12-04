import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TJob } from "../types/job";

const initialState = {
  jobs: [] as TJob[], 
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<TJob[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<TJob>) => {
      state.jobs.push(action.payload);
    },
  },
});

export const jobActions = jobsSlice.actions;
export default jobsSlice.reducer;
