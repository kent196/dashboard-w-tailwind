import React from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { mockDataOrders } from "../../data/mockData";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../components/Header";

const OrderDetail = () => {
  const navigation = useNavigate();
  const { id } = useParams();
  const order = mockDataOrders.find(
    (orderData) => orderData.id === parseInt(id)
  );

  function formatPrice(price) {
    // Convert price to VND format with commas for thousands
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  const handleBack = () => {
    navigation("/orders");
  };

  if (!order) {
    return <Box>Order not found</Box>;
  }

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box>
        <Box display={"flex"} alignItems={"center"} gap={"20px"}>
          <Box>
            <IconButton onClick={handleBack}>
              <ArrowBack />
            </IconButton>
          </Box>
          <Header title={"Order Detail"} />
        </Box>
        <Box
          ml={"60px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"10px"}
          width={"30%"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Order ID:
            </Typography>
            <Typography variant='h5'>{order.id}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Buyer ID:
            </Typography>
            <Typography variant='h5'>{order.buyerId}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Seller ID:
            </Typography>
            <Typography variant='h5'>{order.sellerId}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Buyer Name:
            </Typography>
            <Typography variant='h5'>{order.recipientName}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Buyer Phone:
            </Typography>
            <Typography variant='h5'>{order.recipientPhone}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Buyer Address:
            </Typography>
            <Typography variant='h5'>{order.recipientAddress}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Order Date:
            </Typography>
            <Typography variant='h5'>{order.orderDate}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Total:
            </Typography>
            <Typography variant='h5'>
              {formatPrice(order.totalAmount)}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Shipping Cost:
            </Typography>
            <Typography variant='h5'>
              {formatPrice(order.shippingCost)}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Status:
            </Typography>
            <Typography variant='h5'>
              {order.status === 1 ? "Pending" : order.status}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderDetail;
