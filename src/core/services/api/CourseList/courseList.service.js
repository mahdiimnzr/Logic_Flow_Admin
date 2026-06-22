import useGetQuery from "../../common/useGetQuery";

export const useGetCourseList = (params) =>
  useGetQuery("CourseList", "Course/CourseList", params);
