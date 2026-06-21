import useGetQuery from "../../common/useGetQuery";

export const useGetUserList = (params) =>
  useGetQuery("UsersList", "User/UserMannage", params);
