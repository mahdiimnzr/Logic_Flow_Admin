import { createSlice } from "@reduxjs/toolkit";

const courseCommentsListSlice = createSlice({
  name: "courseCommentsListSlice",
  initialState: {
    params: {
      PageNumber: 1,
      RowsOfPage: 12,
      SortingCol: "insertDate",
      SortType: "desc",
      Query: null,
      Accept: null,
      TeacherId: null,
      userId: null,
    },
  },
  reducers: {
    updateParams: (state, action) => {
      const { key, value } = action.payload;
      state.params = { ...state.params, [key]: value };
    },
  },
});

export default courseCommentsListSlice;
