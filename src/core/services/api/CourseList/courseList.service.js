import deleteParams from "../../common/deleteParams";
import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetCourseList = (params) =>
  useGetQuery("CourseList", "Course/CourseList", params);

export const activeCourse = (body) =>
  putParams("Course/ActiveAndDeactiveCourse", body);

export const updateCourseStatus = (body) =>
  putParams("Course/UpdateCourseStatus", body);

export const useGetCourseDetail = (params) =>
  useGetQuery(`CourseDetail-${params}`, `Course/${params}`);

export const useGetCourseAdd = (params) =>
  useGetQuery("CourseAdd", "Course/GetCreate", params);
export const useGetStatus = () => useGetQuery("CourseStatus", "Status");
export const useGetCourseLevels = () =>
  useGetQuery("CourseLevels", "CourseLevel/GetAllCourseLevel");
export const useGetCourseTypes = () =>
  useGetQuery("CourseTypes", "CourseType/GetCourseTypes");
export const useGetCourseTerms = () => useGetQuery("CourseTerms", "Term");
export const useGetCourseClassRooms = () =>
  useGetQuery("CourseClassRoom", "ClassRoom");
export const updateCourseDetail = (body) => putParams("Course", body);
export const createCourseStepTwo = (body) => postParams("Course", body);
