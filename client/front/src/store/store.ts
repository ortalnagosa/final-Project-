import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import searchSlice from "./searchSlice";
import loadingSlice from "./loadingSlice";
import themeSlice from "./themeSlice";
import  jobsSlice  from "./jobsSlice";

const store = configureStore({
  reducer: { userSlice,jobsSlice, searchSlice, loadingSlice , themeSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const RootReducer = combineReducers({ userSlice,jobsSlice, searchSlice, loadingSlice , themeSlice });
export type TRootState = ReturnType<typeof RootReducer>;
export default store;
