import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';

const UserMetricsChart = ({ dataSeries = [0, 0], skin }) => {
    const textColor = skin === 'dark' ? '#b4b7bd' : '#5e5873';
    const trackColor = skin === 'dark' ? '#3b4253' : 'rgba(128,128,128,0.1)';

    const options = {
        chart: {
            sparkline: { enabled: true }
        },
        colors: ['#7367f0', '#28c76f'],
        plotOptions: {
            radialBar: {
                hollow: { size: '45%' },
                track: { background: trackColor },
                dataLabels: {
                    name: { 
                        fontSize: '13px', 
                        fontFamily: 'IRANYekanXFaNum', 
                        color: textColor 
                    },
                    value: { 
                        fontSize: '15px', 
                        color: textColor, 
                        formatter: val => `${val}%` 
                    },
                    total: {
                        show: true,
                        label: 'شاخص‌ها',
                        color: textColor,
                        formatter: () => 'کاربران'
                    }
                }
            }
        },
        labels: ['کاربران فعال', 'تکمیل پروفایل']
    };

    return (
        <Card className="h-100">
            <CardHeader>
                <CardTitle tag="h4">شاخص‌های کلیدی کاربران</CardTitle>
            </CardHeader>
            <CardBody className="d-flex flex-column align-items-center justify-content-center">

                <Chart options={options} series={dataSeries} type="radialBar" height={240} width="100%" />

                <div className="d-flex justify-content-center w-100 mt-2">
                    <div className="d-flex align-items-center mx-1">
                        <span className="ms-50" style={{ backgroundColor: '#7367f0', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span className="fs-6 me-25" style={{ color: '#7367f0', fontWeight: 'bold' }}>کاربران فعال </span>
                    </div>
                    <div className="d-flex align-items-center mx-1">
                        <span className="ms-50" style={{ backgroundColor: '#28c76f', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span className="fs-6 me-25" style={{ color: '#28c76f', fontWeight: 'bold' }}>تکمیل پروفایل </span>
                    </div>
                </div>

            </CardBody>
        </Card>
    );
};

export default UserMetricsChart;