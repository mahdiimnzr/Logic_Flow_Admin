import deleteParams from "../../common/deleteParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetUserList = (params) =>
  useGetQuery("UsersList", "User/UserMannage", params);
export const deleteUser = (body) => deleteParams("User/DeleteUser", body);
