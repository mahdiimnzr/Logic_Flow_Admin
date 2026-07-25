// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  UncontrolledDropdown
} from 'reactstrap'

const SupportTracker = ({
  primary = '#7367f0', 
  danger = '#ea5455',  
  title,
  totalCount = 0,
  totalTitle = "",
  chartLabel = "",
  statRightTitle = "",
  statRightValue = 0,
  statCenterTitle = "",
  statCenterValue = 0,
  statLeftTitle = "",
  statLeftValue = 0,
  series = [0],
  skin 
}) => {
  
  const textColor = skin === 'dark' ? '#b4b7bd' : '#5e5873';
  const trackBgColor = skin === 'dark' ? '#3b4253' : '#eaebed';

  const options = {
    plotOptions: {
      radialBar: {
        size: 150,
        offsetY: 20,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: '65%'
        },
        track: {
          background: trackBgColor, 
          strokeWidth: '100%'
        },
        dataLabels: {
          name: {
            offsetY: -5,
            fontFamily: 'inherit',
            fontSize: '1rem',
            color: textColor 
          },
          value: {
            offsetY: 15,
            fontFamily: 'inherit',
            fontSize: '1.714rem',
            color: textColor 
          }
        }
      }
    },
    colors: [danger],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      dashArray: 8
    },
    labels: [chartLabel],
  }

  return (
    <Card>
      <CardHeader className='pb-0'>
        <CardTitle tag='h4'>{title}</CardTitle>
        <UncontrolledDropdown className='chart-dropdown'>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm='2' className='d-flex flex-column flex-wrap text-center'>
            <h1 className='font-large-2 fw-bolder mt-2 mb-0'>{totalCount}</h1>
            <CardText>{totalTitle}</CardText>
          </Col>
          <Col sm='10' className='d-flex justify-content-center'>
            <Chart options={options} series={series} type='radialBar' height={270} id='support-tracker-card' />
          </Col>
        </Row>
        <div className='d-flex justify-content-between mt-1'>
          <div className='text-center'>
            <CardText className='mb-50'>{statRightTitle} </CardText>
            <span className='font-large-1 fw-bold'>{statRightValue}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>{statCenterTitle} </CardText>
            <span className='font-large-1 fw-bold'>{statCenterValue}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>{statLeftTitle} </CardText>
            <span className='font-large-1 fw-bold'>{statLeftValue} ٪</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
export default SupportTracker