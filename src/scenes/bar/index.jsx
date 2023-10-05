import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const Bar = () => {
  return (
    <Box width={"100%"}>
      <Box>
        <Header title={"Bar chart"} subTitle={"This is the PAH bar chart"} />
      </Box>
      <Box height={"75vh"}>
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
