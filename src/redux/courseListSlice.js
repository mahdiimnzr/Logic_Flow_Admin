import { createSlice } from "@reduxjs/toolkit";

const courseListSlice = createSlice({
  name: "courseListSlice",
  initialState: {
    params: {
      PageNumber: 1,
      RowsOfPage: 10,
      SortingCol: "lastUpdate",
      SortType: "desc",
      Query: null,
    },
  },
  reducers: {
    updateParams: (state, action) => {
      const { key, value } = action.payload;
      state.params = { ...state.params, [key]: value };
    },
  },
});

export default courseListSlice;
