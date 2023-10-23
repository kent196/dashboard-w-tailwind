import { Box, Typography } from "@mui/material";
import React from "react";

const UserCard = ({ avatar, bidderName, bidDate, bidAmmount, email }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      width={"100%"}
      p={"10px"}
      boxShadow={2}>
      {/* left */}
      <Box
        display={"flex"}
        justifyContent={"flex-start"}
        gap={"10px"}
        width={"60%"}>
        <Box
          width={"100px"}
          height={"100px"}
          display={"flex"}
          justifyContent={"center"}>
          <img
            style={{
              border: "1px solid #000",
              borderRadius: "50%",
            }}
            width={"100%"}
            height={"100%"}
            src={avatar}
          />
        </Box>
        <Box width={"60%"}>
          <Typography variant='h5' fontWeight={"bold"}>
            {bidderName}
          </Typography>
          <Typography variant='h6'>{bidDate}</Typography>
          <Typography variant='h6'>{email}</Typography>
        </Box>
      </Box>
      {/* right */}
      <Box display={"flex"} justifyContent={"flex-end"} width={"40%"}>
        <Box>
          <Typography variant='h5' fontWeight={"bold"}>
            {bidAmmount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCard;
