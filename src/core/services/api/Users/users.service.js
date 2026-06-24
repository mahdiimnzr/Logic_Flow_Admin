import postParams from "../../common/postParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetUserList = (params) =>
  useGetQuery("UsersList", "User/UserMannage", params);
export const createUser = (body) => postParams("User/CreateUser", body);
export const useGetUserDetail = (params) =>
  useGetQuery(`UserDetail-${params}`, `User/UserDetails/${params}`);
