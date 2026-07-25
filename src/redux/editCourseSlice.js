import { createSlice } from "@reduxjs/toolkit";

const editCourseSlice = createSlice({
  name: "editCourseSlice",
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
      StartTime: null,
      EndTime: null,
      GoogleSchema: null,
      GoogleTitle: null,
      CoursePrerequisiteId: null,
      ShortLink: null,
      imageAddress: null,
      CourseStatusId: null,
    },
  },
  reducers: {
    updateParams: (state, action) => {
      const { key, value } = action.payload;
      state.params = { ...state.params, [key]: value };
    },
  },
});

export default editCourseSlice;
