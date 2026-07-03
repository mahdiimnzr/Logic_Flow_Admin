// ** Icons Imports
import { BookOpen, Users } from "react-feather";

// ** Custom Components
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
      icon={<BookOpen size={21} />}
      color={color}
      stats={formattedStats}
      statTitle={title}
      series={series}
      type="area"
    />
  );
};

export default SubscribersGained;
