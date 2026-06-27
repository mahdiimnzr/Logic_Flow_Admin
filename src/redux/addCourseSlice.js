import { createSlice } from "@reduxjs/toolkit";

const addCoursesSlice = createSlice({
  name: "addCourseSlice",
  initialState: {
    params: {
      Title: null,
      Describe: null,
      MiniDescribe: null,
      Capacity: null,
      CourseTypeId: null,
      SessionNumber: null,
      CurrentCoursePaymentNumber: null,
      TremId: null,
      ClassId: null,
      CourseLvlId: null,
      TeacherId: null,
      Cost: null,
      UniqeUrlString: null,
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
