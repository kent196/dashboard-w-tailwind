import React from "react";
import { Box, Typography } from "@mui/material";

const Header = ({ title, subTitle, fontSize, color, textAlign }) => {
  return (
    <Box>
      <Typography
        variant='h3'
        color={color}
        sx={{
          fontWeight: "bold",
          marginBottom: "10px",
          fontSize: fontSize,
          textAlign: "textAlign",
        }}>
        {title}
      </Typography>
      <Typography variant='subtitle1'>{subTitle}</Typography>
    </Box>
  );
};

export default Header;
