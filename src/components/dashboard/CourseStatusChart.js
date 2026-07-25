import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
} from "reactstrap";

const CourseStatusChart = ({ dataSeries = [0, 0, 0], skin }) => {
  const { t } = useTranslation();

  const textColor = skin === "dark" ? "#b4b7bd" : "#5e5873";
  const strokeColor = skin === "dark" ? "#283046" : "#fff";

  const labels = [t("DashboardsHolding"), t("dashboardInactive"), t("Expired")];
  const donutColors = ["#7367f0", "#28c76f", "#ea5455"];

  const options = {
    stroke: { colors: [strokeColor] },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "inherit",
      labels: {
        colors: textColor,
        useSeriesColors: false,
      },
    },
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
            name: {
              fontSize: "1.2rem",
              fontFamily: "inherit",
              color: textColor,
            },
            value: {
              fontSize: "1rem",
              fontFamily: "inherit",
              color: textColor,
              formatter(val) {
                return `${val} ${t("dashboardCourses")}`;
              },
            },
            total: {
              show: true,
              fontSize: "1.2rem",
              fontFamily: "inherit",
              label: t("DashboardsCourses"),
              color: textColor,
              formatter() {
                const total = dataSeries.reduce((a, b) => a + b, 0);
                return `${total}${t("dashboardCourses")}`;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: { chart: { height: 380 }, legend: { position: "bottom" } },
      },
    ],
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <div>
          <CardTitle className="mb-75" tag="h4">
            {t("DashboardsCourseStatus")}
          </CardTitle>
          <CardSubtitle className="text-muted">
            {t("DashboardsStatistics")}
          </CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        <Chart
          options={options}
          series={dataSeries}
          type="donut"
          height={315}
        />
      </CardBody>
    </Card>
  );
};

export default CourseStatusChart;
