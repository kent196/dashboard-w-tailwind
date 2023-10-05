import React from "react";
import { Box, Button, Container, IconButton, Toolbar } from "@mui/material";
import List from "@mui/icons-material/List";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataAuctions } from "../../data/mockData";
import StaffChooser from "../../components/StaffChooser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auction = () => {
  const navigate = useNavigate();
  const [isOpenChooser, setIsOpenChooser] = useState(false);
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  const handleViewAuction = (auctionId) => {
    // Navigate to the user detail page with the user's ID
    navigate(`/auction/${auctionId}`);
  };
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "auctionName",
      headerName: "Auction Name",
      flex: 1,
      cellClassName: "auctionName-column--cell",
    },
    {
      field: "staffName",
      headerName: "Staff Name",
      flex: 1,
      cellClassName: "staffName-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: "auctionName-column--cell",
    },
    {
      field: "assignStaff",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color={colors.primary[400]}
            onClick={() => handleViewAuction(params.row.id)}>
            <List />
          </IconButton>
          <Button
            variant='contained'
            color='primary'
            disabled={params.row.staffName.length > 0}
            onClick={() => setIsOpenChooser(!isOpenChooser)}>
            Assign Staff
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box position={"relative"}>
        {isOpenChooser && (
          <StaffChooser
            isOpenChooser={isOpenChooser}
            setIsOpenChooser={setIsOpenChooser}
          />
        )}

        <Header title={"Auctions"} subTitle={"This is the auction page"} />
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
            rows={mockDataAuctions}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Auction;
