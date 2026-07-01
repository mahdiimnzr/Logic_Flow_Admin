import React, { Fragment, useEffect } from "react";
import Table from "../components/ManagementCourses/terms/index";
import Spinner from "@components/spinner/Fallback-spinner";
import { useTranslation } from "react-i18next";
import { useGetTerm } from "../core/services/api/ManagementCourses/ManagementCourses.service";

const Terms = () => {
  const { t } = useTranslation();
  //   const params = useSelector((state) => state.usersSlice.params);
  const { isLoading, data: TermList } = useGetTerm();
  //   useEffect(() => {
  //     refetch();
  //   }, [params]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      {/* <Breadcrumbs
        title={t("UsersList")}
        data={[{ title: t("Users") }, { title: t("UsersList") }]}
      /> */}
      <div className="app-user-list">
        <Table TermList={TermList?.data} />
      </div>
    </Fragment>
  );
};

export default Terms;
