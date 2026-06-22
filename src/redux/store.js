// ** Redux Imports
import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./usersSlice";
import layout from "./layout";
import navbar from "./navbar";

const store = configureStore({
  reducer: { navbar, layout, usersSlice: usersSlice.reducer },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export { store };
