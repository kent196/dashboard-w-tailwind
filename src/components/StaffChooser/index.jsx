import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

import { token } from "../../theme";
import Header from "../Header";
import { mockDataTeam } from "../../data/mockData";

const StaffChooser = ({ isOpenChooser, setIsOpenChooser }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  return (
    // <Box
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     height: "100vh", // Make the container full viewport height
    //     position: "relative", // Required for absolute positioning
    //   }}>

    <Box
      height={"50%"}
      width={"30%"}
      sx={{
        backgroundColor: `${colors.primary[400]}`,
        zIndex: "100",
        position: "fixed", // Use fixed positioning
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Center horizontally and vertically
        boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
        padding: "10px",
        overflowY: "scroll",
      }}>
      <Box position={"fixed"} top={"2%"} right={"2%"} zIndex='200'>
        <IconButton
          sx={{
            backgroundColor: `${colors.redAccent[600]}`,
            "&:hover": {
              backgroundColor: `${colors.redAccent[700]}`,
            },
          }}
          onClick={() => setIsOpenChooser(false)}>
          <Close />
        </IconButton>
      </Box>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Box>
          <Header title={"Staff Chooser"} />
          <Typography variant='h6' color={colors.primary[300]}>
            Available staff
          </Typography>
        </Box>
        {/* List of staff */}
        <Box
          width={"50%"}
          sx={{
            "& :hover": {
              backgroundColor: `${colors.primary[900]}`,
              cursor: "pointer",
            },
          }}>
          {mockDataTeam.map((staff) => (
            <Box
              key={staff.id}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              p={"5px"}
              m={"5px"}
              sx={{
                backgroundColor: `${colors.primary[400]}`,
                borderRadius: "4px",
              }}>
              <Typography variant='h6' color={colors.primary[300]}>
                {staff.name}
              </Typography>
              <Typography variant='h6' color={colors.primary[300]}>
                {staff.access}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StaffChooser;
