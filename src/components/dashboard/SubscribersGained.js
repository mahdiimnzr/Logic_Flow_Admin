// ** Icons Imports
import { Users } from 'react-feather'

// ** Custom Components
import StatsWithAreaChart from './StatsWithAreaChart'

const SubscribersGained = ({ title, subscribers = 0, series = [], kFormatter }) => {

    const formattedStats = kFormatter ? kFormatter(subscribers) : subscribers;

    return (
        <StatsWithAreaChart
            icon={<Users size={21} />}
            color='primary'
            stats={formattedStats}
            statTitle={title}
            series={series}
            type='area'
        />
    )
}

export default SubscribersGained