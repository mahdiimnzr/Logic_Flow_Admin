import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
} from "reactstrap";

const BlogInteractionChart = ({ likes = 0, dislikes = 0 }) => {
  const { t } = useTranslation();
  const series = [likes, dislikes];

  const labels = [t("BlogLikes"), t("BlogDislikes")];

  const donutColors = ["#7367f0", "#ff9f43"];

  const options = {
    legend: { show: true, position: "bottom", fontFamily: "inherit" },
    labels: labels,
    colors: donutColors,
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: { fontSize: "1.2rem", fontFamily: "inherit" },
            value: {
              fontSize: "1rem",
              fontFamily: "inherit",
              formatter(val) {
                return `${val} ${t("BlogVotes")}`;
              },
            },
            total: {
              show: true,
              fontSize: "1.2rem",
              fontFamily: "inherit",
              label: t("BlogTotalVotes"),
              formatter() {
                return `${likes + dislikes} رای`;
              },
            },
          },
        },
      },
    },
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <div>
          <CardTitle className="mb-75" tag="h4">
            {t("BlogInteractionChartTitle")}
          </CardTitle>
          <CardSubtitle className="text-muted">
            {t("BlogInteractionChartSubtitle")}
          </CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        {likes > 0 || dislikes > 0 ? (
          <Chart options={options} series={series} type="donut" height={320} />
        ) : (
          <div className="text-center py-5 text-muted">
            {t("BlogNoInteraction")}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BlogInteractionChart;
