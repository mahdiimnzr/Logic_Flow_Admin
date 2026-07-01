import Table from "../components/courses/list/index";
import { Fragment, useEffect } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Breadcrumbs from "@components/breadcrumbs";
import {
  useGetCourseList,
  useGetStatus,
} from "../core/services/api/CourseList/courseList.service";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CoursesList = () => {
  const { t } = useTranslation();
  const params = useSelector((state) => state.courseListSlice.params);
  const { isLoading, data: courseList, refetch } = useGetCourseList(params);
  const { isLoading: statusLoading } = useGetStatus();

  useEffect(() => {
    refetch();
  }, [params]);

  return isLoading || statusLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("List")}
        data={[{ title: t("Courses") }, { title: t("List") }]}
      />
      <Table courseList={courseList?.data} />
    </Fragment>
  );
};

export default CoursesList;
