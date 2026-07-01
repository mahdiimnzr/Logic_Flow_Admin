import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetTechnology = () => useGetQuery("Technology", "Technology");
export const updateTechnology = (body) => putParams("/Technology", body);
export const postTechnology = (body) => postParams("/Technology", body);

export const useGetCourseLevel = () =>
  useGetQuery("CourseLevel", "CourseLevel/GetAllCourseLevel");
export const postCourseLevel = (body) => postParams("/CourseLevel", body);

export const useGetStatus = () => useGetQuery("Status", "/Status");
export const postStatus = (body) => postParams("/Status", body);
export const updateStatus = (body) => putParams("/Status", body);

export const useGetTerm = () => useGetQuery("Term", "/Term");
