import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";
import useGetQueries from "../../common/useGetQueries";

export const useGetUserList = (params) =>
  useGetQuery("UsersList", "User/UserMannage", params);
export const useGetUsers = (params) =>
  useGetQuery("Users", "User/UserMannage", params);

export const createUser = (body) => postParams("User/CreateUser", body);
export const useGetUserDetail = (params) =>
  useGetQuery(`UserDetail-${params}`, `User/UserDetails/${params}`);
export const updateUserDetail = (body) => putParams("User/UpdateUser", body);
export const addUserAccess = (params) =>
  postParams(`User/AddUserAccess?Enable=${params.currentAccess}`, params.body);
export const useGetCourseDetails = (ids, enabled) =>
  useGetQueries(
    ids.map((id) => ({
      queryKey: `CourseDetail-${id}`,
      pathUrl: `Course/${id}`,
      enabled,
    })),
  );
export const acceptCourseReserve = (body) =>
  postParams("CourseReserve/SendReserveToCourse", body);
export const useGetCourseGroupCourses = (items, enabled) =>
  useGetQueries(
    items.map((item) => ({
      queryKey: `CourseGroup-${item?.TeacherId}-${item?.CourseId}`,
      pathUrl: "CourseGroup/GetCourseGroup",
      params: { TeacherId: item?.TeacherId, CourseId: item?.CourseId },
      enabled,
    })),
  );
