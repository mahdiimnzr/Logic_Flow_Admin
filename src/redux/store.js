// ** Redux Imports
import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./usersSlice";
import layout from "./layout";
import navbar from "./navbar";
import courseListSlice from "./courseListSlice";
import courseCommentsListSlice from "./courseCommentsListSlice";
import addCoursesSlice from "./addCourseSlice";
import editCourseSlice from "./editCourseSlice";
import scheduleSlice from "./scheduleSlice";

const store = configureStore({
  reducer: {
    navbar,
    layout,
    usersSlice: usersSlice.reducer,
    courseListSlice: courseListSlice.reducer,
    courseCommentsListSlice: courseCommentsListSlice.reducer,
    addCourseSlice: addCoursesSlice.reducer,
    editCourseSlice: editCourseSlice.reducer,
    scheduleSlice: scheduleSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export { store };
