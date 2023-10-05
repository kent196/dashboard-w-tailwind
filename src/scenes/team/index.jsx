// Libraries import
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React from "react";

// Local imports
import { Helmet } from "react-helmet";
import ActionButtons from "../../components/ActionButtons";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockData";
import { token } from "../../theme";

const Team = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const theme = useTheme();
  const colors = token(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "access",
      flex: 1,
      headerName: "Access Level",
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            flex={"1"}
            width={"60%"}
            m={"0 auto"}
            p={"5px"}
            display={"flex"}
            justifyContent={"center"}
            gap={"10px"}
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius={"4px"}>
            {access === "admin" && <AdminPanelSettingsOutlined />}
            {access === "manager" && <SecurityOutlined />}
            {access === "user" && <LockOpenOutlined />}
            {!isSmallScreen && (
              <Typography
                color={colors.gray[100]}
                sx={{
                  textTransform: "uppercase",
                }}>
                {access}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => <ActionButtons row={params.row} />,
    },
  ];
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>User Management</title>
      </Helmet>
      <Header title='Users' subTitle={"This page shows all the user data"} />
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          rows={mockDataTeam}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Container>
  );
};

export default Team;
