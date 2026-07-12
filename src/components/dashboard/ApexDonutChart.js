// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'

const ApexRadiarChart = ({ data = [] }) => {

  const series = data.map(item => item.countUsed);
  const labels = data.map(item => item.techName);

  const donutColors =
    ['#ffe700', '#00d4bd', '#826bf8', '#2b9bf4', '#FFA1A1',
      '#ff9f43', '#28c76f', '#ea5455', '#7367f0']

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: 'bottom',
      fontFamily:"inherit",
      labels: {
        useSeriesColors: true
      }
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
              fontSize: '1.5rem',
              fontFamily: 'inherit',
              color: 'var(--bs-heading-color)'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'inherit',
              color: 'var(--bs-heading-color)',
              formatter(val) {
                return `${parseInt(val)}دوره`
              }
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              fontFamily:"inherit",
              label: 'همه موارد',
              color: 'var(--bs-heading-color)',
              formatter() {
                const total = series.reduce((a, b) => a + b, 0)
                return `${total} مورد`
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.2rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.2rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            تکنولوژی دوره‌ها
          </CardTitle>
          <CardSubtitle className='text-muted'>آمار استفاده از فناوری‌های مختلف</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        {series.length > 0 ?
          (
            <Chart options={options} series={series} type='donut' height={350} />
          ) : (<div className='text-center py-5 text-muted'> داده ایی برای نمایش وجود ندارد </div>)
        }
      </CardBody>
    </Card>
  )
}

export default ApexRadiarChart
