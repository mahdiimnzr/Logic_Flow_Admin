import { createSlice } from "@reduxjs/toolkit";

const addCoursesSlice = createSlice({
  name: "addCourseSlice",
  initialState: {
    params: {
      Title: null,
      Cost: null,
      SortingCol: null,
      SortType: null,
      Query: null,
      MiniDescribe: null,
      EndTime: null,
      StartTime: null,
    },
  },
  reducers: {
    updateParams: (state, action) => {
      const { key, value } = action.payload;
      state.params = { ...state.params, [key]: value };
    },
  },
});

export default addCoursesSlice;
