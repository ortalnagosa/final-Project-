import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { TUser } from "../types/user";



const initialState = {
  user: null as TUser | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.data.user;
    },
    logout: (state) => {
      state.user = null;
      toast.success("התנתק בהצלחה");
    },
    updateProfile: (state, action) => {
      state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      toast.success("הפרופיל עודכן!");
    },
    setUser: (state, action) => {
 state.user = action.payload;
 localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
