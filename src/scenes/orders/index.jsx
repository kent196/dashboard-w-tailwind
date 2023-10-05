import { useTheme } from "@emotion/react";
import { Box, Container, IconButton } from "@mui/material";
import React from "react";

import { ListOutlined } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { mockDataOrders } from "../../data/mockData";
import { token } from "../../theme";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Orders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "buyerId",
      headerName: "Buyer ID",
    },
    {
      field: "sellerId",
      headerName: "Seller ID",
    },
    {
      field: "recipientName",
      headerName: "Buyer",
      flex: 1,
    },
    {
      field: "recipientPhone",
      headerName: "Buyer Phone",
      flex: 1,
    },
    {
      field: "recipientAddress",
      headerName: "Buyer Address",
      flex: 1,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
    },
    {
      field: "totalAmount",
      headerName: "Total",
    },
    {
      field: "shippingCost",
      headerName: "Shipping Cost",
    },
    {
      field: "status",
      headerName: "Order Status",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color={colors.primary[400]}
            onClick={() => handleViewOrder(params.row.id)}>
            <ListOutlined />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <Box>
        <Box>
          <Header title={"Orders"} />
        </Box>
        <Box
          m={"20px 0"} // Reduced top margin
          sx={{
            overflowX: "auto", // Add horizontal scroll for smaller screens
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .auctionName-column--cell": {
              color: colors.primary[300],
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
          <DataGrid
            style={{
              fontSize: "18px",
            }}
            rows={mockDataOrders}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Orders;
