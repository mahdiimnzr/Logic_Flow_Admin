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
      teacher: {
        startDate: null,
        endDate: null,
      },
      student: {
        startDate: null,
        endDate: null,
        StudentId: null,
      },
    },
  },
  reducers: {
    updateAdminParams: (state, action) => {
      const { key, value } = action.payload;
      state.params.admin = { ...state.params.admin, [key]: value };
    },
    updateTeacherParams: (state, action) => {
      const { key, value } = action.payload;
      state.params.teacher = { ...state.params.teacher, [key]: value };
    },
    updateStudentParams: (state, action) => {
      const { key, value } = action.payload;
      state.params.student = { ...state.params.student, [key]: value };
    },
  },
});

export default scheduleSlice;
