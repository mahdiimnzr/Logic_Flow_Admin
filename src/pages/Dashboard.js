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

import {
  getLandingReport,
  getDashboardAdminReport,
  getTechnologyReport,
  useGetCurrentUserDetail,
  getAllTeachers,
  getAdminCourseList,
} from "./../core/services/api/dashboard/dashboard.service";
import toast from "react-hot-toast";


const Dashboard = () => {

  const [dashboardReport, setDashboardReport] = useState(null);
  const [teachersCount, setTeachersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [techReport, setTechReport] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [courseStatus, setCourseStatus] = useState([0, 0, 0]);

  const { isLoading: userLoading, data } = useGetCurrentUserDetail();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, teachersRes, coursesRes, techRes] = await Promise.all([
          getDashboardAdminReport(),
          getAllTeachers(),
          getAdminCourseList({ PageNumber: 1, RowsOfPage: 20, SortingCol: "DESC" }),
          getTechnologyReport()
        ]);

        const dashData = dashboardRes?.data ? dashboardRes.data : dashboardRes;
        const teachersData = teachersRes?.data ? teachersRes.data : teachersRes;
        const coursesData = coursesRes?.data ? coursesRes.data : coursesRes;
        const technologyData = techRes?.data ? techRes.data : techRes;

        setDashboardReport(dashData);
        setTechReport(technologyData);

        if (teachersData && Array.isArray(teachersData)) {
          setTeachersCount(teachersData.length);
        }

        if (coursesData && coursesData.courseDtos) {
          const allCourses = coursesData.courseDtos;

          setCoursesCount(coursesData.totalCount !== undefined ? coursesData.totalCount : allCourses.length);
          setLatestCourses(allCourses.slice(0, 5));

          let active = 0;
          let inactive = 0;
          let expired = 0;

          allCourses.forEach(course => {
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
    if (num >= 1e15) return (num / 1e15).toFixed(1) + " هزار همت";
    if (num >= 1e12) return (num / 1e12).toFixed(1) + " همت";
    if (num >= 1e9) return (num / 1e9).toFixed(1) + " میلیارد";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + " میلیون";
    return num.toLocaleString("fa-IR");
  };

  return isLoading || userLoading ? (
    <div className="d-flex justify-content-center mt-5">
      <Spinner color="primary" />
    </div>
  ) : (
    <div id="dashboard-analytics">

      <Row className="match-height">

        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="primary"
            icon={<Users size={21} />}
            stats={dashboardReport?.allUser?.toString() || "0"}
            statTitle="کل کاربران"
          />
        </Col>

        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="success"
            icon={<UserCheck size={21} />}
            stats={teachersCount.toString()}
            statTitle="تعداد اساتید"
          />
        </Col>

        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="info"
            icon={<BookOpen size={21} />}
            stats={coursesCount.toString()}
            statTitle="کل دوره‌ها"
          />
        </Col>

        <Col lg="3" sm="6" className="mb-2">
          <StatsHorizontal
            color="warning"
            icon={<CreditCard size={21} />}
            stats={
              dashboardReport?.allPaymentCost
                ? `${formatLargeNumber(dashboardReport.allPaymentCost)} تومان`
                : "0 تومان"
            }
            statTitle="مجموع پرداختی‌ها"
          />
        </Col>

      </Row>

      <Row className="match-height">

        <Col lg="6" md="12" sm="12" className="mb-2">
          <CourseStatusChart dataSeries={courseStatus} />
        </Col>

        <Col lg="6" md="12" sm="12" className="mb-2">
          <SupportTracker
            title="وضعیت رزروها"
            totalTitle="کل رزروها"
            totalCount={dashboardReport?.allReserve || 0}
            chartLabel="درصد تایید"
            series={[dashboardReport?.reserveAcceptPercent || 0]}

            statRightTitle="در انتظار"
            statRightValue={
              (dashboardReport?.allReserve || 0) - (dashboardReport?.allReserveAccept || 0)
            }
            statCenterTitle="تایید شده"
            statCenterValue={dashboardReport?.allReserveAccept || 0}
            statLeftTitle="لغو شده"
            statLeftValue={dashboardReport?.reserveNotAcceptPercent || 0}
          />
        </Col>

      </Row>

      <Row className="match-height mt-2">

        <Col lg="6" md="12" sm="12" className="mb-2">
          <ApexRadiarChart data={techReport} />
        </Col>

        <Col lg="6" md="12" sm="12" className="mb-2">
          <LatestCoursesTable courses={latestCourses} />
        </Col>

      </Row>

    </div>
  );
};

export default Dashboard;
