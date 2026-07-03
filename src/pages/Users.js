import React, { Fragment, useEffect } from "react";
import Table from "../components/users/Table";
import { useGetUsers } from "../core/services/api/Users/users.service";
import Spinner from "@components/spinner/Fallback-spinner";
import { useSelector } from "react-redux";
import Breadcrumbs from "@components/breadcrumbs";
import { useTranslation } from "react-i18next";

const Users = () => {
  const { t } = useTranslation();
  const params = useSelector((state) => state.usersSlice.params);
  const {
    isLoading,
    isFetching,
    data: usersList,
    refetch,
  } = useGetUsers(params);
  useEffect(() => {
    refetch();
  }, [params]);
  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("UsersList")}
        data={[{ title: t("Users") }, { title: t("UsersList") }]}
      />
      <div className="app-user-list">
        <Table usersList={usersList?.data} isFetching={isFetching} />
      </div>
    </Fragment>
  );
};

export default Users;
