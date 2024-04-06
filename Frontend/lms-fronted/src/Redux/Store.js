import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "./Slices/AuthSlice";
import CourseSlice from "./Slices/CourseSlice";

const store = configureStore({
  reducer: {
    auth: AuthSliceReducer,
    Course: CourseSlice
  },
  devTools: true,
});

export default store;
