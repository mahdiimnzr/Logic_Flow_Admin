import addCoursesSlice from "./addCourseSlice";
import courseCommentsListSlice from "./courseCommentsListSlice";
import courseListSlice from "./courseListSlice";
import usersSlice from "./usersSlice";

export const { updateParams } = usersSlice.actions;
export const { updateParams: updateCourseListParams } = courseListSlice.actions;
export const { updateParams: updateCommentCourseListParams } =
  courseCommentsListSlice.actions;
export const { updateParams: updateAddCourseSliceParams } =
  addCoursesSlice.actions;
