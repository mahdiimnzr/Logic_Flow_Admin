import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "scheduleSlice",
  initialState: {
    params: {
      admin: {
        startDate: null,
        endDate: null,
        courseId: null,
      },
    },
  },
  reducers: {
    updateAdminParams: (state, action) => {
      const { key, value } = action.payload;
      state.params.admin = { ...state.params.admin, [key]: value };
    },
  },
});

export default scheduleSlice;
