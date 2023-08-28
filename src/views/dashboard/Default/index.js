import { useEffect, useState } from "react";
import axios from "axios";

// material-ui
import { Grid } from "@mui/material";

// project imports
import EarningCard from "./EarningCard";
import TotalOrderLineChartCard from "./TotalOrderLineChartCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import TotalGrowthBarChart from "./TotalGrowthBarChart";
import { gridSpacing } from "store/constant";
import { useNavigate } from "react-router";

// base URl
import baseUrl from "../../baseUrl";

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  const [totalStaff, setTotalStaff] = useState();
  const [totalTransaction, setTotalTransaction] = useState();
  const [totalSalary, setTotalSalary] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/dashboard/total`,
      headers: {
        token: token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setTotalStaff(response.data.Data.totalStaff);
        setTotalTransaction(response.data.Data.totalTransaction);
        setTotalSalary(response.data.Data.totalSalary);
      })
      .catch((error) => {
        if (error.response.data === "Invalid Token") {
          localStorage.clear();
          navigate = "/";
        } else {
          console.error("Error:", error);
        }
      });
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              totalTransaction={totalTransaction}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard
              isLoading={isLoading}
              totalStaff={totalStaff}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard
                  isLoading={isLoading}
                  totalSalary={totalSalary}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
