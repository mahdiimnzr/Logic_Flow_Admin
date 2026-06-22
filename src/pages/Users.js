import React, { Fragment } from "react";
import Table from "../components/users/Table";
import { useGetUserList } from "../core/services/api/Users/users.service";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import { useSelector } from "react-redux";

const Users = () => {
  const params = useSelector((state) => state.usersSlice.params);
  const { isLoading, data: usersList } = useGetUserList(params);
  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="app-user-list">
        <Table usersList={usersList?.data} />
      </div>
    </Fragment>
  );
};

export default Users;
