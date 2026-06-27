// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardBody } from 'reactstrap'

import { areaChartOptions } from './ChartOptions'

const StatsWithAreaChart = ({ 
  icon, 
  color = 'primary', 
  stats, 
  statTitle, 
  series, 
  options = areaChartOptions, 
  type, 
  height = 100, 
  className, 
  ...rest 
}) => {
  return (
    <Card {...rest}>
      <CardBody
        className={classnames('pb-0', {
          [className]: className
        })}
      >
        <Avatar className='avatar-stats p-50 m-0' color={`light-${color}`} icon={icon} />
        <h2 className='fw-bolder mt-1'>{stats}</h2>
        <p className='card-text'>{statTitle}</p>
      </CardBody>
      <Chart options={options} series={series} type={type} height={height} />
    </Card>
  )
}

export default StatsWithAreaChart

// ** PropTypes
StatsWithAreaChart.propTypes = {
  type: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // برای ساپورت عدد و رشته
  options: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string,
  stats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // برای جلوگیری از ارور وقتی عدد پاس میدیم
  series: PropTypes.array.isRequired,
  statTitle: PropTypes.string.isRequired
}