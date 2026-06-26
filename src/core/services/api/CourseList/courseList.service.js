import deleteParams from "../../common/deleteParams";
import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetCourseList = (params) =>
  useGetQuery("CourseList", "Course/CourseList", params);

export const activeCourse = (body) =>
  putParams("Course/ActiveAndDeactiveCourse", body);

export const useGetStatus = () => useGetQuery("Status", "Status");

export const updateCourseStatus = (body) =>
  putParams("Course/UpdateCourseStatus", body);

export const useGetCourseDetail = (params) =>
  useGetQuery("CourseDetail", `Course/${params}`);

export const useGetCourseAdd = (params) =>
  useGetQuery("CourseAdd", "Course/GetCreate", params);
