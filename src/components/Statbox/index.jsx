import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";
import React from "react";

const Statbox = ({ title, subTitle, icon, children, width, height }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  return (
    <Box
      width={"80%"}
      m={"20px 30px"}
      sx={{
        bgcolor: "white",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        padding: "10px 20px",
      }}>
      {children ? (
        <Box width={width} height={height}>
          {children}
        </Box>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Box>{icon}</Box>
          <Box display={"flex"} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Typography variant='h4' fontWeight={"bold"}>
                {title}
              </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"flex-end"}>
              {" "}
              <Typography variant='h5'>{subTitle}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Statbox;
