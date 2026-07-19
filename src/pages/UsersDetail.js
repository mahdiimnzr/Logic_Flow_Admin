import { Fragment, useEffect, useState } from "react";
import { Row, Col, TabContent, TabPane } from "reactstrap";
import Spinner from "@components/spinner/Fallback-spinner";
import Breadcrumbs from "@components/breadcrumbs";
import AccountSetting from "../components/usersDetail/AccountSetting";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import {
  useGetUserDetail,
  useGetCourseDetails,
  useGetCourseGroupCourses,
} from "../core/services/api/Users/users.service";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../components/usersDetail/Tabs";
import UserCourses from "../components/usersDetail/UserCourses";
import UserReserveCourses from "../components/usersDetail/UserReserveCourses";
import toast from "react-hot-toast";

const UsersDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  const { isLoading, data: userDetail } = useGetUserDetail(userId);

  const user = userDetail?.data;

  const courseStudentQueries = useGetCourseDetails(
    user?.courseStudent?.map((value) => value.courseId) ?? [],
    !isLoading && !!user,
  );

  const courseReserveQueries = useGetCourseDetails(
    user?.courseReserve?.map((value) => value.courseId) ?? [],
    !isLoading && !!user,
  );

  const courseGroupQueries = useGetCourseGroupCourses(
    courseReserveQueries.map((value, index) => ({
      TeacherId: value.data?.data?.teacherId,
      CourseId: user?.courseReserve?.[index]?.courseId,
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
      accept: user?.courseReserve?.[index]?.accept,
      groupId: courseGroupQueries[index]?.data?.data,
    }));

  const coursesLoading =
    courseStudentQueries.some((value) => value.isLoading) ||
    courseReserveQueries.some((value) => value.isLoading) ||
    courseGroupQueries.some((value) => value.isLoading);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (userDetail?.data?.success === false) {
      navigate("/Users/List");
      toast.error(userDetail?.data?.message);
    }
  }, [userDetail]);

  if (isLoading || coursesLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs
        title={t("ProfileDetails")}
        data={[
          { title: t("Users"), link: "/Users/List" },
          { title: t("ProfileDetails") },
        ]}
      />

      {user && (
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <AccountSetting data={user} />
              </TabPane>
            </TabContent>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="2">
                <UserCourses data={courses} />
              </TabPane>
            </TabContent>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="3">
                <UserReserveCourses data={reserveCourses} reserveIs={user} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default UsersDetail;
