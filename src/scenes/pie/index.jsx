import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const Pie = () => {
  return (
    <Box>
      <Box>
        <Header title={"Pie chart"} subTitle={"This is the PAH pie chart"} />
      </Box>
      <Box height={"75vh"}>
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
