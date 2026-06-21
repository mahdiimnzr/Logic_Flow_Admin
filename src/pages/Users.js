import React, { Fragment } from "react";
import Table from "../components/users/Table";
import { useGetUserList } from "../core/services/api/Users/users.service";

const Users = () => {
  const { isLoading, data: usersList } = useGetUserList();
  return (
    <Fragment>
      <Table />
    </Fragment>
  );
};

export default Users;
