import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import baseUrl from "../../baseUrl";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

// project imports
import SkeletonTotalGrowthBarChart from "ui-component/cards/Skeleton/TotalGrowthBarChart";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";

const token = localStorage.getItem("token");

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const [chartDataList, setChartDataList] = useState([]);
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  const [chartData, setChartData] = useState({
    height: 480,
    type: "bar",
    options: {
      chart: {
        id: "bar-chart",
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "80%",
        },
        style: {
          borderRadius: 5
        }
      },
      xaxis: {
        type: "category",
        categories: [],
      },
      legend: {
        show: true,
        fontSize: "14px",
        fontWeight: "800px",
        fontFamily: `'Roboto', sans-serif`,
        position: "bottom",
        offsetX: 20,
        labels: {
          useSeriesColors: false,
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8,
        },
      },
      fill: {
        type: "solid",
      },
      dataLabels: {
        enabled: true,
      },
      grid: {
        show: true,
      },
    },
    series: [],
  });

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/dashboard/monthsTransactions?months=12`,
      headers: {
        token: token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        setChartDataList(response.data.data);

        // Extracting months and updating x-axis categories
        const months = response.data.data.map((item) => item.month); // Assuming month is the property name
        setChartData((prevChartData) => ({
          ...prevChartData,
          options: {
            ...prevChartData.options,
            xaxis: {
              ...prevChartData.options.xaxis,
              categories: months,
            },
          },
          series: [
            {
              name: "Transaction Amount",
              data: response.data.data.map((item) => item.amount),
            },
          ],
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: secondaryMain,
      xaxis: {
        labels: {
          style: {
            colors: grey500,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: grey500,
            fontWeight: 700,
          },
        },
      },
      grid: {
        borderColor: grey200,
      },
      tooltip: {
        theme: "light",
      },
      legend: {
        labels: {
          colors: grey500,
          fontWeight: 700,
        },
      },
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, "updateOptions", newChartData);
    }
  }, [
    navType,
    primary200,
    primaryDark,
    secondaryMain,
    secondaryLight,
    primary,
    darkLight,
    grey200,
    isLoading,
    grey500,
  ]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">$2,324.00</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalGrowthBarChart;
