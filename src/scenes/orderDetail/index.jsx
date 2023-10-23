import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { mockDataOrders } from "../../data/mockData";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";
import { useState } from "react";
import { useEffect } from "react";
import { fetchOrderDetails } from "../../libs/orderService";
import { fetchProduct } from "../../libs/productServices";
import ProductDetailModal from "../../components/ProductDetailModal";

const OrderDetail = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const navigation = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);
  const [productDetails, setProductDetails] = useState({
    startingPrice: 0,
  });

  const [orderDetail, setOrderDetail] = useState({
    totalAmount: 0,
    shippingCost: 0,
    orderItems: [],
  });

  const handleViewProduct = (productId) => {
    // Set isLoadingProductDetails to true when loading starts
    setIsLoading(true);
    // Fetch product details
    fetchProduct(productId)
      .then((res) => {
        console.log(res.data);
        setProductDetails(res.data);
        // Set isLoadingProductDetails to false when loading is complete
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // Set isLoadingProductDetails to false on error as well
        setIsLoading(false);
      });
    setIsOpenProductDetail(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchOrderDetails(id)
      .then((res) => {
        console.log(`Response: ${res}`);
        setOrderDetail(res.data);
        console.log(`Order details: ${orderDetail}`);
      })
      .catch((err) => {
        console.log(err);
      });
    // cleanup
    return () => {
      setOrderDetail({ totalAmount: 0, shippingCost: 0, orderItems: [] });
    };
  }, []);

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

  if (!orderDetail) {
    return <Box>Order not found</Box>;
  }

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      {/* Nav */}
      <Box
        p={"10px"}
        borderRadius={"5px"}
        display={"flex"}
        gap={"20px"}
        justifyContent={"flex-start"}
        alignItems={"center"}>
        <Box>
          <Button
            variant='outlined'
            onClick={handleBack}
            size='large'
            startIcon={<ArrowBack />}>
            Trở lại
          </Button>
        </Box>
        <Box>
          <Typography variant='h5'>Đơn hàng số {orderDetail.id}</Typography>
        </Box>
      </Box>
      {/* Content */}
      <Box m={"30px 0 "}>
        {/* Status */}

        {/* Order info */}
        <Box>
          {/* top */}
          <Box
            boxShadow={"0 0 2px #000"}
            p={"20px 40px"}
            borderRadius={"5px"}
            sx={{
              backgroundColor: "white",
            }}
            m={"20px 0"}>
            <Box
              borderRadius={"5px"}
              sx={{
                backgroundColor: "white",
              }}
              display={"flex"}
              justifyContent={"flex-start"}
              gap={"20px"}
              alignItems={"center"}
              m={"20px 0"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Trạng thái:
              </Typography>
              <Chip
                sx={{ textTransform: "uppercase", fontSize: "1rem" }}
                label={
                  orderDetail.status === 1
                    ? "Chờ thanh toán"
                    : orderDetail.status === 2
                    ? "Chờ lấy hàng"
                    : orderDetail.status === 3
                    ? "Đang vận chuyển"
                    : orderDetail.status === 4
                    ? "Đã vận chuyển"
                    : orderDetail.status === 5
                    ? "Chờ xác nhận"
                    : orderDetail.status === 10
                    ? "Bị từ chối"
                    : orderDetail.status === 11
                    ? "Người mua hủy"
                    : orderDetail.status === 12
                    ? "Người bán hủy"
                    : "Đang cập nhật"
                }
                color={
                  orderDetail.status === 1
                    ? "info"
                    : orderDetail.status === 2
                    ? "success"
                    : orderDetail.status === 3
                    ? "default"
                    : orderDetail.status === 4
                    ? "info"
                    : orderDetail.status === 5
                    ? "success"
                    : orderDetail.status === 6
                    ? "warning"
                    : orderDetail.status === 7
                    ? "secondary"
                    : "error"
                }
              />
            </Box>
            <Box>
              <Header title={"Thông tin khách hàng"} fontSize={"25px"} />
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant='h5'>Tên khách hàng:</Typography>
              <Typography variant='h5'>{orderDetail.recipientName}</Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant='h5'>SDT:</Typography>
              <Typography variant='h5'>{orderDetail.recipientPhone}</Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant='h5'>Địa chỉ giao hàng:</Typography>
              <Typography variant='h5'>
                {orderDetail.recipientAddress}
              </Typography>
            </Box>
          </Box>
          {/* bottom */}
          <Box
            boxShadow={"0 0 2px #000"}
            p={"20px 40px"}
            borderRadius={"5px"}
            sx={{
              backgroundColor: "white",
            }}
            m={"20px 0"}>
            <Box>
              <Header title={"Thông tin sản phẩm"} fontSize={"25px"} />
            </Box>
            <Box
              width={"100%"}
              height={"150px"}
              p={"20px"}
              sx={{
                overflowY: "scroll",
              }}>
              {orderDetail.orderItems.map((item) => (
                <Box
                  key={item.productId}
                  onClick={() => {
                    console.log(item.id);
                    handleViewProduct(item.productId);
                  }}
                  display={"flex"}
                  justifyContent={"space-between"}
                  margin={"10px 0"}>
                  <Box
                    display={"flex"}
                    justifyContent={"flex-start"}
                    gap={"20px"}>
                    <img width={"100px"} height={"100px"} src={item.imageUrl} />
                    <Box>
                      <Typography variant='h5'>
                        Tên sản phẩm: {item.productName}
                      </Typography>
                      <Typography variant='h5'>
                        Số lượng: x{item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {" "}
                    <Typography variant='h5'>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            {/* Dash */}
            <Box
              m={"20px 0"}
              width={"100%"}
              height={"1px"}
              backgroundColor={"#000"}></Box>
            <Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant='h5'>Tổng tiền:</Typography>
                <Typography variant='h5'>
                  {formatPrice(orderDetail.totalAmount)}
                </Typography>
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant='h5'>Phí vận chuyển:</Typography>
                <Typography variant='h5'>
                  {formatPrice(orderDetail.shippingCost)}
                </Typography>
              </Box>
              {/* Dash */}
              <Box
                m={"20px 0"}
                width={"100%"}
                height={"1px"}
                backgroundColor={"#000"}></Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant='h5'>Thành tiền:</Typography>
                <Typography variant='h5'>
                  {formatPrice(
                    orderDetail.shippingCost + orderDetail.totalAmount
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <ProductDetailModal
        isLoadingProductDetails={isLoading}
        isOpenProductDetail={isOpenProductDetail}
        setIsOpenProductDetail={setIsOpenProductDetail}
        productDetails={productDetails}
      />
    </Container>
  );
};

export default OrderDetail;
