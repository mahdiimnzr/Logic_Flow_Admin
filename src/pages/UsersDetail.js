// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";

// ** Demo Components
import Spinner from "@components/spinner/Fallback-spinner";

import Breadcrumbs from "@components/breadcrumbs";
import AccountSetting from "../components/usersDetail/AccountSetting";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

import {
  useGetUserDetail,
  useGetCourseDetails,
  useGetCourseGroupCourses,
} from "../core/services/api/Users/users.service";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../components/usersDetail/Tabs";
import UserCourses from "../components/usersDetail/UserCourses";
import UserReserveCourses from "../components/usersDetail/UserReserveCourses";

const UsersDetail = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  const { isLoading, data: userDetail } = useGetUserDetail(userId);

  const courseStudentQueries = useGetCourseDetails(
    userDetail?.data?.courseStudent.map((value) => value.courseId) ?? [],
    !isLoading && !!userDetail,
  );

  const courseReserveQueries = useGetCourseDetails(
    userDetail?.data?.courseReserve.map((value) => value.courseId) ?? [],
    !isLoading && !!userDetail,
  );

  const courseGroupQueries = useGetCourseGroupCourses(
    courseReserveQueries.map((value, index) => ({
      TeacherId: value.data?.data?.teacherId,
      CourseId: userDetail?.data?.courseReserve[index]?.courseId,
    })),
    courseReserveQueries.every((value) => value.isSuccess),
  );

  const courses = courseStudentQueries
    .filter((value) => value.isSuccess)
    .map((value) => value.data?.data);

  const reserveCourses = courseReserveQueries
    .filter(
      (value, index) => value.isSuccess && courseGroupQueries[index]?.isSuccess,
    )
    .map((value, index) => ({
      ...value.data?.data,
      accept: userDetail?.data?.courseReserve[index]?.accept,
      groupId: courseGroupQueries[index]?.data?.data,
    }));

  const coursesLoading =
    courseStudentQueries.some((value) => value.isLoading) ||
    courseReserveQueries.some((value) => value.isLoading) ||
    courseGroupQueries.some((value) => value.isLoading);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return isLoading || coursesLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("ProfileDetails")}
        data={[
          { title: t("Users"), link: "/Users/List" },
          { title: t("ProfileDetails") },
        ]}
      />
      {userDetail?.data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <AccountSetting data={userDetail?.data} />
              </TabPane>
            </TabContent>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="2">
                <UserCourses data={courses} />
              </TabPane>
            </TabContent>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="3">
                <UserReserveCourses
                  data={reserveCourses}
                  reserveIs={userDetail?.data}
                />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
};

export default UsersDetail;
