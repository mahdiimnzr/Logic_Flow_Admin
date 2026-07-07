import Chart from 'react-apexcharts'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'

const CourseStatusChart = ({ dataSeries = [0, 0, 0] }) => {
  
  const labels = [' در حال برگزاری', 'غیرفعال', 'منقضی شده']
  const donutColors = ['#7367f0', '#28c76f', '#ea5455']
  const options = {
    legend: {
      show: true,
      position: 'bottom',
      fontFamily: "inherit",
    },
    labels: labels,
    colors: donutColors,
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem',
              fontFamily: 'inherit'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'inherit',
              formatter(val) {
                return `${val} دوره`
              }
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              fontFamily: "inherit",
              label: 'کل دوره‌ها',
              formatter() {
                const total = dataSeries.reduce((a, b) => a + b, 0)
                return `${total} دوره`
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: { chart: { height: 380 }, legend: { position: 'bottom' } }
      }
    ]
  }

  return (
    <Card className="h-100">
      <CardHeader>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            وضعیت دوره‌ها
          </CardTitle>
          <CardSubtitle className='text-muted'>آمار تفکیکی دوره‌های سایت</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={dataSeries} type='donut' height={315} />
      </CardBody>
    </Card>
  )
}

export default CourseStatusChart