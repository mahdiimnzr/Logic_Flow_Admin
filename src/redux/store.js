// ** Redux Imports
import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./usersSlice";
import layout from "./layout";
import navbar from "./navbar";
import courseListSlice from "./courseListSlice";
import courseCommentsListSlice from "./courseCommentsListSlice";

const store = configureStore({
  reducer: {
    navbar,
    layout,
    usersSlice: usersSlice.reducer,
    courseListSlice: courseListSlice.reducer,
    courseCommentsListSlice: courseCommentsListSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export { store };
