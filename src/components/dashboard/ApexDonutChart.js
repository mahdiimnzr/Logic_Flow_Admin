// ** Third Party Components
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
} from "reactstrap";

const ApexRadiarChart = ({ data = [], skin }) => {
  const { t } = useTranslation();

  const textColor = skin === "dark" ? "#b4b7bd" : "#5e5873";
  const strokeColor = skin === "dark" ? "#283046" : "#fff";

  const series = data.map((item) => item.countUsed);
  const labels = data.map((item) => item.techName);

  const donutColors = [
    "#ffe700",
    "#00d4bd",
    "#826bf8",
    "#2b9bf4",
    "#FFA1A1",
    "#ff9f43",
    "#28c76f",
    "#ea5455",
    "#7367f0",
  ];

  // ** Chart Options
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
              fontSize: "1.5rem",
              fontFamily: "inherit",
              color: textColor,
            },
            value: {
              fontSize: "1rem",
              fontFamily: "inherit",
              color: textColor,
              formatter(val) {
                return `${parseInt(val)} ${t("Courses")}`;
              },
            },
            total: {
              show: true,
              fontSize: "1.2rem",
              fontFamily: "inherit",
              label: t("DashboardsAllItems"),
              color: textColor,
              formatter() {
                const total = series.reduce((a, b) => a + b, 0);
                return `${total} ${t("dashboardItems")}`;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1.2rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1.2rem",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="mb-75" tag="h4">
            {t("DashboardsTechnology")}
          </CardTitle>
          <CardSubtitle className="text-muted">
            {t("DashboardsTechnologyStatistics")}
          </CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        {series.length > 0 ? (
          <Chart options={options} series={series} type="donut" height={350} />
        ) : (
          <div className="text-center py-5 text-muted">
            {t("DashboardsShow")}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ApexRadiarChart;
