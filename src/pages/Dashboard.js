import React from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Users, UserCheck, BookOpen, CreditCard } from "react-feather";
import Spinner from "@components/spinner/Fallback-spinner";
import CardCongratulations from "../components/dashboard/CardCongratulations";
import SubscribersGained from "../components/dashboard/SubscribersGained";
import SupportTracker from "./../components/dashboard/SupportTracker";
import ApexRadiarChart from "../components/dashboard/ApexDonutChart";
import StatsHorizontal from "../components/dashboard/StatsHorizontal";
import CourseStatusChart from "../components/dashboard/CourseStatusChart";
import LatestCoursesTable from "../components/dashboard/LatestCourseTable";
import TopBlogsTable from "../components/dashboard/TopBlogsTable";
import UserMetricsChart from "../components/dashboard/UserMetricsChart";
import UserRolesChart from "../components/dashboard/UserRolesChart";
import "@styles/react/libs/react-select/_react-select.scss";

import { useSkin } from "@hooks/useSkin";

import {
  getLandingReport,
  getDashboardAdminReport,
  getTechnologyReport,
  useGetCurrentUserDetail,
  getAllTeachers,
  getAdminCourseList,
  getAdminUserList,
} from "./../core/services/api/dashboard/dashboard.service";
import { getAdminBlogsList } from "./../core/services/api/blogs/blogs.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { skin } = useSkin();
  const { t } = useTranslation();

  const [dashboardReport, setDashboardReport] = useState(null);
  const [teachersCount, setTeachersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [techReport, setTechReport] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [courseStatus, setCourseStatus] = useState([0, 0, 0]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [userMetrics, setUserMetrics] = useState([0, 0]);
  const [userRoles, setUserRoles] = useState([0, 0, 0, 0]);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          dashboardRes,
          teachersRes,
          coursesRes,
          techRes,
          blogsRes,
          usersRes,
        ] = await Promise.all([
          getDashboardAdminReport(),
          getAllTeachers(),
          getAdminCourseList({
            PageNumber: 1,
            RowsOfPage: 500,
            SortingCol: "DESC",
          }),
          getTechnologyReport(),
          getAdminBlogsList({ RowsoFPage: 200 }),
          getAdminUserList({ PageNumber: 1, RowsOfPage: 500 }),
        ]);

        const dashData = dashboardRes?.data ? dashboardRes.data : dashboardRes;
        const teachersData = teachersRes?.data ? teachersRes.data : teachersRes;
        const coursesData = coursesRes?.data ? coursesRes.data : coursesRes;
        const technologyData = techRes?.data ? techRes.data : techRes;
        const blogsData = blogsRes?.news
          ? blogsRes.news
          : blogsRes?.data?.news
          ? blogsRes.data.news
          : [];
        const usersRootData = usersRes?.data ? usersRes.data : usersRes;
        const usersData = usersRootData?.listUser ? usersRootData.listUser : [];

        setDashboardReport(dashData);
        setTechReport(technologyData);

        if (teachersData && Array.isArray(teachersData)) {
          setTeachersCount(teachersData.length);
        }

        if (coursesData && coursesData.courseDtos) {
          const allCourses = coursesData.courseDtos;

          setCoursesCount(
            coursesData.totalCount !== undefined
              ? coursesData.totalCount
              : allCourses.length,
          );
          setLatestCourses(allCourses.slice(0, 5));

          let active = 0;
          let inactive = 0;
          let expired = 0;

          allCourses.forEach((course) => {
            if (course.isExpire) {
              expired++;
            } else if (course.isActive) {
              active++;
            } else {
              inactive++;
            }
          });
          setCourseStatus([active, inactive, expired]);
        }

        if (Array.isArray(blogsData)) {
          const sortedBlogs = [...blogsData]
            .sort((a, b) => (b.currentView || 0) - (a.currentView || 0))
            .slice(0, 5);
          setTopBlogs(sortedBlogs);
        }

        if (Array.isArray(usersData) && usersData.length > 0) {
          const totalUsers = usersData.length;
          const activeUsers = usersData.filter((u) => u.active).length;
          const activePercent = Math.round((activeUsers / totalUsers) * 100);

          const totalCompletion = usersData.reduce(
            (sum, u) => sum + (u.profileCompletionPercentage || 0),
            0,
          );
          const avgCompletion = Math.round(totalCompletion / totalUsers);

          setUserMetrics([activePercent, avgCompletion]);

          let admin = 0,
            teacher = 0,
            student = 0,
            god = 0;
          usersData.forEach((user) => {
            if (user.roles) {
              user.roles.forEach((role) => {
                if (role === "admin") admin++;
                else if (role === "teacher") teacher++;
                else if (role === "student") student++;
                else if (role === "GOD") god++;
              });
            }
          });
          setUserRoles([admin, teacher, student, god]);
        }

        if (usersRootData?.totalCount !== undefined) {
          setUsersCount(usersRootData.totalCount);
        } else if (usersData.length > 0) {
          setUsersCount(usersData.length);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatLargeNumber = (num) => {
    if (!num) return "0";

    if (num >= 1e15)
      return `${(num / 1e15).toFixed(1)} ${t("dashboardThousandHemat")}`;

    if (num >= 1e12) return `${(num / 1e12).toFixed(1)} ${t("dashboardHemat")}`;

    if (num >= 1e9) return `${(num / 1e9).toFixed(1)} ${t("dashboardBillion")}`;

    if (num >= 1e6) return `${(num / 1e6).toFixed(1)} ${t("dashboardMillion")}`;

    return num.toLocaleString(i18n.language === "fa" ? "fa-IR" : "en-US");
  };

  return isLoading ? (
    <div className="d-flex justify-content-center mt-5">
      <Spinner color="primary" />
    </div>
  ) : (
    <div
      id="dashboard-analytics"
      className={skin === "dark" ? "text-white" : "text-body"}
    >
      <Row className="match-height">
        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="primary"
            icon={<Users size={21} />}
            stats={usersCount ? usersCount.toLocaleString("fa-IR") : "0"}
            statTitle={
              <span className={skin === "dark" ? "text-light" : "text-body"}>
                {t("DashboardsUsers")}
              </span>
            }
          />
        </Col>
        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="success"
            icon={<UserCheck size={21} />}
            stats={teachersCount.toString()}
            statTitle={
              <span className={skin === "dark" ? "text-light" : "text-body"}>
                {t("DashboardsTeacher")}
              </span>
            }
          />
        </Col>
        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="info"
            icon={<BookOpen size={21} />}
            stats={coursesCount.toString()}
            statTitle={
              <span className={skin === "dark" ? "text-light" : "text-body"}>
                {t("DashboardsCourses")}
              </span>
            }
          />
        </Col>
        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="warning"
            icon={<CreditCard size={21} />}
            stats={
              dashboardReport?.allPaymentCost
                ? `${formatLargeNumber(dashboardReport.allPaymentCost)} ${t(
                    "dashboardMoney",
                  )}`
                : `0 ${t("dashboardMoney")}`
            }
            statTitle={
              <span className={skin === "dark" ? "text-light" : "text-body"}>
                {t("dashboardPayments")}
              </span>
            }
          />
        </Col>
      </Row>
      <Row className="match-height mt-2">
        <Col lg="6" md="12" sm="12" className="mb-2">
          <UserMetricsChart dataSeries={userMetrics} skin={skin} />
        </Col>
        <Col lg="6" md="12" sm="12" className="mb-2">
          <UserRolesChart dataSeries={userRoles} skin={skin} />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="6" md="12" sm="12" className="mb-2">
          <CourseStatusChart dataSeries={courseStatus} skin={skin} />
        </Col>
        <Col lg="6" md="12" sm="12" className="mb-2">
          <SupportTracker
            title={t("DashboardsStatus")}
            totalTitle={t("DashboardsTotalBookings")}
            totalCount={dashboardReport?.allReserve || 0}
            chartLabel={t("DashboardsPercentage")}
            series={[dashboardReport?.reserveAcceptPercent || 0]}
            statRightTitle={t("DashboardsWaiting")}
            statRightValue={
              (dashboardReport?.allReserve || 0) -
              (dashboardReport?.allReserveAccept || 0)
            }
            statCenterTitle={t("Accept")}
            statCenterValue={dashboardReport?.allReserveAccept || 0}
            statLeftTitle={t("DashboardsCancel")}
            statLeftValue={dashboardReport?.reserveNotAcceptPercent || 0}
            skin={skin}
          />
        </Col>
      </Row>
      <Row className="match-height mt-2">
        <Col lg="6" md="12" sm="12" className="mb-2">
          <ApexRadiarChart data={techReport} skin={skin} />
        </Col>
        <Col lg="6" md="12" sm="12" className="mb-2">
          <LatestCoursesTable courses={latestCourses} skin={skin} />
        </Col>
      </Row>
      <Row className="match-height mt-2">
        <Col lg="12" md="12" sm="12" className="mb-2">
          <TopBlogsTable blogs={topBlogs} skin={skin} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
