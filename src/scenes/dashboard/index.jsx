import React from "react";
import { Helmet } from "react-helmet";
import BarChart from "../../components/BarChart";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box height={"75vh"}>
        <BarChart isDashboard={true} />
      </Box>{" "}
    </div>
  );
};

export default Dashboard;
