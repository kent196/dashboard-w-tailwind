import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuList,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import {
  ListOutlined,
  Visibility,
  VisibilityOutlined,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { mockDataOrders } from "../../data/mockData";
import { token } from "../../theme";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { fetchOrders } from "../../libs/orderService";
import { formatDateTime } from "../../libs/formaters";
import MenuItem from "@mui/material/MenuItem";
import NullBox from "../../components/NullBox";
const Orders = () => {
  const [isOpenViewOrder, setIsOpenViewOrder] = useState(false);
  const [orders, setOrders] = useState([]); // State to store orders
  const [orderDetails, setOrderDetails] = useState({
    totalAmount: 0,
    shippingCost: 0,
  }); // State to store order details
  const [ordersCount, setOrdersCount] = useState(0); // State to store auction details
  const [rowCountState, setRowCountState] = React.useState(ordersCount || 0);

  const navigate = useNavigate();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(3);

  const [pageInput, setPageInput] = useState(1); // State for page input
  const [pageSizeInput, setPageSizeInput] = useState(3);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Tất cả"); // Default selected filter
  const [filterValue, setFilterValue] = useState(0); // Default selected filter

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (filter, value) => {
    setAnchorEl(null);
    if (filter) {
      setSelectedFilter(filter);
      setFilterValue(value);
      // You can perform some filtering action here based on the selected filter.
      // For demonstration purposes, we're just updating the state.
    }
  };

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      ordersCount !== undefined ? ordersCount : prevRowCountState
    );
  }, [ordersCount, setRowCountState]);
  const colors = token(theme.palette.mode);

  function formatPrice(price) {
    // Convert price to VND format with commas for thousands
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchOrders(paginationModel.pageSize, paginationModel.page + 1, filterValue)
      .then((res) => {
        setOrdersCount(res.data.count);
        setOrders(res.data.list);
      })
      .catch((err) => {});

    return () => {
      setOrders([]);
    };
  }, [paginationModel, filterValue]);

  const handleViewOrder = (orderId) => {
    // setIsOpenViewOrder(true);
    // const res = mockDataOrders.find((orderData) => orderData.id === orderId);
    // if (!res) {
    //   return <Box>Order not found</Box>;
    // }
    // setOrderDetails(res);
    navigate(`/orders/${orderId}`);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },

    {
      field: "recipientName",
      headerName: "Tên người mua",
      flex: 1,
    },
    {
      field: "recipientPhone",
      headerName: "SDT người mua",
      flex: 1,
    },

    {
      field: "orderDate",
      headerName: "Ngày đặt hàng",
      flex: 2,
      renderCell: (params) => formatDateTime(params.row.orderDate),
    },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      flex: 1,
      renderCell: (params) => formatPrice(params.row.totalAmount),
    },
    {
      field: "shippingCost",
      headerName: "Phí giao hàng",
      flex: 1,
      renderCell: (params) => formatPrice(params.row.shippingCost),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1.5,
      renderCell: (params) => (
        <Chip
          sx={{ textTransform: "uppercase", fontSize: "1rem" }}
          label={
            params.row.status === 1
              ? "Chờ thanh toán"
              : params.row.status === 2
              ? "Chờ lấy hàng"
              : params.row.status === 3
              ? "Đang vận chuyển"
              : params.row.status === 4
              ? "Đã vận chuyển"
              : params.row.status === 5
              ? "Chờ xác nhận"
              : params.row.status === 10
              ? "Bị từ chối"
              : params.row.status === 11
              ? "Người mua hủy"
              : params.row.status === 12
              ? "Người bán hủy"
              : "Đang cập nhật"
          }
          color={
            params.row.status === 1
              ? "info"
              : params.row.status === 2
              ? "success"
              : params.row.status === 3
              ? "default"
              : params.row.status === 4
              ? "info"
              : params.row.status === 5
              ? "success"
              : params.row.status === 6
              ? "warning"
              : params.row.status === 7
              ? "secondary"
              : "error"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (row) => (
        <>
          <IconButton
            color={colors.primary[400]}
            onClick={() => handleViewOrder(row.id)}>
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  return orders != null ? (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Đơn hàng</title>
      </Helmet>
      <Box>
        <Box>
          <Header title={"Danh sách đơn hàng"} />
        </Box>

        <Box
          m={"20px 0"} // Reduced top margin
          sx={{
            overflowX: "auto", // Add horizontal scroll for smaller screens
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiMenu-list": {
              height: "200px",
              overflowY: "scroll",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .auctionName-column--cell": {
              color: colors.primary[300],
            },
            "& .MuiTablePagination-toolbar": {
              // display: "none",
            },
            "& .staffName-column--cell": {
              color: colors.primary[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.gray[900],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: colors.gray[900],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.gray[100]} !important `,
            },

            // Media queries for responsive column width
            "@media (max-width: 768px)": {
              "& .access-column": {
                // Adjust the width for smaller screens
                flexBasis: "20%",
              },
            },
            "@media (max-width: 480px)": {
              "& .access-column": {
                // Further adjust the width for mobile screens
                flexBasis: "15%",
              },
            },
          }}>
          {/* filter button with dropdown selection */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
            }}>
            <Button
              sx={{ width: "200px" }}
              variant='contained'
              startIcon={<ListOutlined />}
              onClick={handleClick}>
              {selectedFilter}
            </Button>
            <Menu
              sx={{
                zIndex: 9999,
                padding: "10px",
                // height: "300px",
                overflowY: "scroll",
                "& .MuiMenu-list": {
                  height: "100px",
                },
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleClose(null)} // Close the menu when clicking outside
            >
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Tất cả", 0)}>
                Tất cả
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Chờ thanh toán", 1)}>
                Chờ thanh toán
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Chờ xác nhận", 5)}>
                Chờ xác nhận
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Hủy bởi người bán", 12)}>
                Hủy bởi người bán
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Hủy chờ duyệt", 10)}>
                Hủy chờ duyệt
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Hủy bởi người mua", 11)}>
                Hủy bởi người mua
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Chờ lấy hàng", 2)}>
                Chờ lấy hàng
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Đang giao hàng", 3)}>
                Đang giao hàng
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Đã giao", 4)}>
                Đã giao
              </MenuItem>
              <MenuItem
                style={{
                  padding: "5px",
                }}
                onClick={() => handleClose("Hoàn tất", 6)}>
                Hoàn tất
              </MenuItem>
              {/* Add more filter options as needed */}
            </Menu>
          </Box>

          <DataGrid
            style={{
              fontSize: "18px",
            }}
            rows={orders}
            columns={columns}
            // components={{ Toolbar: GridToolbar }}
            rowCount={rowCountState}
            pageSizeOptions={[1, 3, 5]}
            paginationModel={paginationModel}
            paginationMode='server'
            onPaginationModelChange={setPaginationModel}
          />
        </Box>
      </Box>

      {/* View order details */}
      <Dialog
        fullWidth
        open={isOpenViewOrder}
        onClose={() => setIsOpenViewOrder(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' variant='h4'>
          Chi tiết đơn hàng số {orderDetails.id}
        </DialogTitle>
        <DialogContent>
          <Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                ID:
              </Typography>
              <Typography variant='h5'>{orderDetails.id}</Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                ID Người mua :
              </Typography>
              <Typography variant='h5'>{orderDetails.buyerId}</Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                ID Người bán :
              </Typography>
              <Typography variant='h5'>{orderDetails.sellerId}</Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Tên người mua :
              </Typography>
              <Typography variant='h5'>{orderDetails.recipientName}</Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Số điện thoại người mua:
              </Typography>
              <Typography variant='h5'>
                {orderDetails.recipientPhone}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Địa chỉ nhận hàng người mua:
              </Typography>
              <Typography variant='h5'>
                {orderDetails.recipientAddress}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Ngày đặt hàng:
              </Typography>
              <Typography variant='h5'>{orderDetails.orderDate}</Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Tổng tiền:
              </Typography>
              <Typography variant='h5'>
                {formatPrice(orderDetails.totalAmount)}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Phí giao hàng:
              </Typography>
              <Typography variant='h5'>
                {formatPrice(orderDetails.shippingCost)}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={"20px"}
              alignItems={"center"}>
              <Typography variant='h4' fontWeight={"bold"}>
                Trạng thái:
              </Typography>
              <Typography variant='h5'>
                {orderDetails.status === 1 ? "Pending" : orderDetails.status}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  ) : (
    <NullBox
      header={"Chưa có đơn hàng nào để hiển thị"}
      navTo={"dashboard"}
      buttonText={"bảng điều khiển"}
    />
  );
};

export default Orders;
