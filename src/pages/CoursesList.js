import Table from "../components/courses/list/index";
import { Fragment } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import { useGetCourseList } from "../core/services/api/CourseList/courseList.service";

const CoursesList = () => {
  const { isLoading, data: courseList, refetch } = useGetCourseList();
  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title="لیست دوره ها"
        data={[{ title: "دوره ها" }, { title: "لیست دوره ها" }]}
      />
      <Table courseList={courseList?.data} />
    </Fragment>
  );
};

export default CoursesList;
