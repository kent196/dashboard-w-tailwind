import React from "react";
import { Box, Container, IconButton } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { token } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataProducts } from "../../data/mockData";
import { DeleteOutline, List } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Products = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = token(theme.palette.mode);

  const handleViewProduct = (productId) => {
    // Navigate to the user detail page with the user's ID
    navigate(`/product/${productId}`);
  };
  const column = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "sellerId",
      headerName: "Seller ID",
    },
    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
    },
    {
      field: "description",
      flex: 1,
      headerName: "Description",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      // Use the valueFormatter to format the price
      valueFormatter: (params) => {
        // Format the price to VND with commas for thousands
        return params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      field: "origin",
      headerName: "Origin",
    },
    {
      field: "type",
      headerName: "Type",
      // Use the valueGetter to conditionally render the value
      valueGetter: (params) => {
        if (params.row.type === 0) {
          return "For Sale";
        } else if (params.row.type === 1) {
          return "For Auction";
        } else {
          return params.row.type; // Display the original value if not 0
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Box>
            <IconButton onClick={() => handleViewProduct(params.row.id)}>
              <List />
            </IconButton>
            <IconButton>
              <DeleteOutline color='error' />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <Box>
        <Box>
          <Header title={"Products list"} />
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
            rows={mockDataProducts}
            columns={column}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
