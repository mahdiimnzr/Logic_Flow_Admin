import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetTechnology = () => useGetQuery("Technology", "Technology");
export const updateTechnology = (body) => putParams("Technology", body);
export const postTechnology = (body) => postParams("Technology", body);

export const useGetCourseLevel = () =>
  useGetQuery("CourseLevel", "CourseLevel/GetAllCourseLevel");
export const postCourseLevel = (body) => postParams("/CourseLevel", body);

export const useGetStatus = () => useGetQuery("Status", "Status");
export const postStatus = (body) => postParams("Status", body);
export const updateStatus = (body) => putParams("Status", body);

export const useGetTerm = () => useGetQuery("Term", "Term");
export const postTerm = (body) => postParams("Term", body);
export const updateTerm = (body) => putParams("Term", body);

export const useGetDepartments = () => useGetQuery("Departments", "Department");
export const updateDepartments = (body) => putParams("Department", body);
export const addDepartments = (body) => postParams("Department", body);

export const useGetBuildings = () => useGetQuery("Buildings", "Building");
export const postAddTermCloseDate = (body) =>
  postParams("/Term/AddTermCloseDate", body);
export const UpdateTermCloseDate = (body) =>
  putParams("Term/UpdateTermCloseDate", body);

export const useGetClassRooms = () => useGetQuery("ClassRooms", "ClassRoom");
export const updateClassRooms = (body) => putParams("ClassRoom", body);
export const addClassRooms = (body) => postParams("ClassRoom", body);
