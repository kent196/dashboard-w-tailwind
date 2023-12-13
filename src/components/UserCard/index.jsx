import { Box, Typography } from "@mui/material";
import React from "react";
import { formatPrice } from "../../libs/formaters";

const UserCard = ({
  avatar,
  bidderName,
  bidDate,
  bidAmmount,
  email,
  icon,
  numberOfDoneOrders,
  color,
  isDashboard,
}) => {
  return (
    <Box
      bgcolor={color}
      display={"flex"}
      justifyContent={"space-between"}
      width={"95%"}
      p={"10px"}
      margin={"10px"}
      boxShadow={3}
      borderRadius={"15px"}>
      {/* left */}
      <Box
        display={"flex"}
        flex={1}
        justifyContent={"flex-start"}
        width={isDashboard ? "100%" : "70%"}>
        <Box
          width={"100px"}
          height={"100px"}
          display={"flex"}
          justifyContent={"center"}
          sx={{
            objectFit: "contain",
            overflow: "hidden",
          }}>
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
        <Box marginLeft={"10px"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"10px"}
            alignItems={"center"}>
            <Typography variant='h5' fontWeight={"bold"}>
              {bidderName}
            </Typography>
            <Box>{icon}</Box>
          </Box>
          <Typography variant='h6'>{bidDate}</Typography>
          <Typography variant='h6'>{email}</Typography>
          <Typography variant='h6'>
            {numberOfDoneOrders && `Số đơn hàng đã đặt: ${numberOfDoneOrders}`}
          </Typography>
        </Box>
      </Box>
      {/* right */}
      {bidAmmount && (
        <Box display={"flex"} justifyContent={"flex-end"} width={"40%"}>
          <Box>
            <Typography variant='h5' fontWeight={"bold"}>
              {bidAmmount && formatPrice(bidAmmount)}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserCard;
