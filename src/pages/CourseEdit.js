import { Fragment, useState } from "react";
import { Row, Col } from "reactstrap";
import Spinner from "@components/spinner/Fallback-spinner";
import Breadcrumbs from "@components/breadcrumbs";
import EditInformation from "../components/courses/EditCourse/EditInformation";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetCourseDetail,
  useGetCourseClassRooms,
  useGetCourseLevels,
  useGetCourseTerms,
  useGetCourseTypes,
  useGetStatus,
} from "../core/services/api/CourseList/courseList.service";
import { useGetUserList } from "../core/services/api/Users/users.service";

const CoursesEdit = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();

  const { isLoading, data: courseDetail } = useGetCourseDetail(courseId);
  const { isLoading: loadingStatus } = useGetStatus();
  const { isLoading: loadingLevels } = useGetCourseLevels();
  const { isLoading: loadingTypes } = useGetCourseTypes();
  const { isLoading: loadingTerms } = useGetCourseTerms();
  const { isLoading: loadingClassRooms } = useGetCourseClassRooms();
  const { isLoading: usersLoading, data: usersList } = useGetUserList({
    RowsOfPage: 1000,
  });

  return isLoading ||
    loadingStatus ||
    loadingLevels ||
    loadingTypes ||
    loadingTerms ||
    loadingClassRooms ||
    usersLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("UpdateCourse")}
        data={[
          { title: t("Courses"), link: "/Courses/List" },
          { title: t("UpdateCourse") },
        ]}
      />
      <Row>
        <Col xs={12}>
          <EditInformation
            data={courseDetail?.data}
            usersList={usersList?.data}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export default CoursesEdit;
