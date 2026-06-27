import React from 'react'
import { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'reactstrap'

import CardCongratulations from '../components/dashboard/CardCongratulations'
import SubscribersGained from '../components/dashboard/SubscribersGained'
import SupportTracker from './../components/dashboard/SupportTracker';
import ApexRadiarChart from '../components/dashboard/ApexDonutChart';

import { getLandingReport, getDashboardAdminReport, getTechnologyReport } from './../core/services/api/dashboard/dashboard.service';
import toast from 'react-hot-toast'

const Dashboard = () => {

  const [landingReport, setLandingReport] = useState(null);
  const [dashboardReport, setDashboardReport] = useState(null);
  const [techReport, setTechReport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [landingRes, dashboardRes, techRes] = await Promise.all([
          getLandingReport(),
          getDashboardAdminReport(),
          getTechnologyReport(),
        ]);
        setLandingReport(landingRes);
        setDashboardReport(dashboardRes);
        setTechReport(techRes);

      } catch (error) {
        toast.error("Eorror loading data!");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className='d-flex justify-content-center mt-5'><Spinner color='primary' /></div>
  }

  return (
    <div id="dashboard-analytics">
      <Row className="match-height">
        <Col lg="6" md="12" sm="12">
          <CardCongratulations name="رضا" number="۱۰" />
        </Col>
        <Col lg="3" sm="6">
          <SubscribersGained
            title="تعداد دانشجویان"
            subscribers={landingReport?.studentCount || 0}
            series={[{ name: "دانشجویان", data: [10, 20, 30, landingReport?.studentCount || 0] }]}
          />
        </Col>
        <Col lg="3" sm="6">
          <SubscribersGained
            title="تعداد اساتید"
            subscribers={landingReport?.teacherCount || 0}
            series={[{ name: "اساتید", data: [2, 4, 6, landingReport?.teacherCount || 0] }]}
          />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="6" md="12" sm="12">
          <SupportTracker
            title="وضعیت دوره‌ها"
            totalTitle='کل دوره‌ها'
            totalCount={landingReport?.courseCount || 0}
            chartLabel='دوره‌ها'
            series={[100]}
            statRightTitle='در حال برگزاری'
            statRightValue='-'
            statCenterTitle='تکمیل شده'
            statCenterValue='-'
            statLeftTitle='منقضی شده'
            statLeftValue='-'
          />
        </Col>
        <Col lg="6" md="12" sm="12">
          <SupportTracker
            title="وضعیت رزروها"
            totalTitle='کل رزروها'
            totalCount={dashboardReport?.allReserve || 0}
            chartLabel='تایید شده'
            series={[dashboardReport?.reserveAcceptPercent || 0]}
            statRightTitle='در انتظار'
            statRightValue={dashboardReport?.allReserve - dashboardReport?.allReserveAccept || 0}
            statCenterTitle='تایید شده'
            statCenterValue={dashboardReport?.allReserveAccept || 0}
            statLeftTitle='لغو شده'
            statLeftValue={dashboardReport?.reserveNotAcceptPercent || 0}
          />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col>
          <ApexRadiarChart data={techReport} />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
