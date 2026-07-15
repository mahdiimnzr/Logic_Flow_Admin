import addCoursesSlice from "./addCourseSlice";
import courseCommentsListSlice from "./courseCommentsListSlice";
import courseListSlice from "./courseListSlice";
import editCourseSlice from "./editCourseSlice";
import scheduleSlice from "./scheduleSlice";
import usersSlice from "./usersSlice";

export const { updateParams } = usersSlice.actions;
export const { updateParams: updateCourseListParams } = courseListSlice.actions;
export const { updateParams: updateCommentCourseListParams } =
  courseCommentsListSlice.actions;
export const { updateParams: updateAddCourseSliceParams } =
  addCoursesSlice.actions;
export const { updateParams: updateEditCourseSliceParams } =
  editCourseSlice.actions;
export const { updateAdminParams, updateTeacherParams, updateStudentParams } =
  scheduleSlice.actions;
