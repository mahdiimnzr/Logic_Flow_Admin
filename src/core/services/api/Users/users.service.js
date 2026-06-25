import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetUserList = (params) =>
  useGetQuery("UsersList", "User/UserMannage", params);
export const createUser = (body) => postParams("User/CreateUser", body);
export const useGetUserDetail = (params) =>
  useGetQuery(`UserDetail-${params}`, `User/UserDetails/${params}`);
export const updateUserDetail = (body) => putParams("User/UpdateUser", body);
export const addUserAccess = (params) =>
  postParams(`User/AddUserAccess?Enable=${params.currentAccess}`, params.body);
