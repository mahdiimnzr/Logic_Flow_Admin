import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';

const UserRolesChart = ({ dataSeries = [0, 0, 0, 0] }) => {
  const options = {
    colors: ['#7367f0', '#ff9f43', '#28c76f', '#ea5455'], 
    chart: {
      type: 'donut'
    },
    stroke: { width: 0 },
    labels: [' Admin', ' Teacher', ' Student', ' GOD'],
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontFamily: 'IRANYekanXFaNum',
      labels: { useSeriesColors: true }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: { fontSize: '14px', fontFamily: 'IRANSans' },
            value: { fontSize: '16px', formatter: val => `${val} نفر` },
            total: {
              show: true,
              label: 'کل نقش‌ها',
              formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    }
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <CardTitle tag="h4">توزیع نقش‌های کاربران</CardTitle>
      </CardHeader>
      <CardBody className="d-flex align-items-center justify-content-center">
        <Chart options={options} series={dataSeries} type="donut" height={280} width="100%" />
      </CardBody>
    </Card>
  );
};

export default UserRolesChart;