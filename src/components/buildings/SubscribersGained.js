import { Database } from "react-feather";
import StatsWithAreaChart from "../dashboard/StatsWithAreaChart";

const SubscribersGained = ({
  title,
  subscribers = 0,
  series = [],
  kFormatter,
  color = "primary",
}) => {
  const formattedStats = kFormatter ? kFormatter(subscribers) : subscribers;

  return (
    <StatsWithAreaChart
      icon={<Database size={21} />}
      color={color}
      stats={formattedStats}
      statTitle={title}
      series={series}
      type="area"
    />
  );
};

export default SubscribersGained;
