import React, { Fragment, useEffect } from "react";
import Table from "../components/comments/Table";
import Spinner from "@components/spinner/Fallback-spinner";
import { useSelector } from "react-redux";
import Breadcrumbs from "@components/breadcrumbs";
import { useTranslation } from "react-i18next";
import { useGetCourseCommentsList } from "../core/services/api/Comments/comments.service";
import { useGetUserList } from "../core/services/api/Users/users.service";

const Comments = () => {
  const { t } = useTranslation();
  const params = useSelector((state) => state.courseCommentsListSlice.params);
  const {
    isLoading,
    data: courseCommentsList,
    refetch,
  } = useGetCourseCommentsList(params);
  const { isLoading: usersLoading, data: usersList } = useGetUserList({
    RowsOfPage: 1000,
  });
  useEffect(() => {
    refetch();
  }, [params]);

  return isLoading || usersLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("UsersList")}
        data={[{ title: t("Users") }, { title: t("UsersList") }]}
      />
      <div className="app-user-list">
        <Table
          commentsList={courseCommentsList?.data}
          usersList={usersList?.data}
        />
      </div>
    </Fragment>
  );
};

export default Comments;
