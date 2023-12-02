// Libraries import
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  Person2Outlined,
  SecurityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

// Local imports
import { Helmet } from "react-helmet";
import ActionButtons from "../../components/ActionButtons";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockData";
import { token } from "../../theme";
import {
  fetchAllStaffs,
  fetchCustomer,
  fetchUsers,
} from "../../libs/userService";
import { fetchUserData } from "../../libs/accountServices";
import Unauthorize from "../../global/Unauthorize";
import Error from "../../global/Error";
import NullBox from "../../components/NullBox";

const Team = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const colors = token(theme.palette.mode);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false); // State to store loading status
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [userCount, setUserCount] = React.useState(0);
  const [customerCount, setCustomerCount] = React.useState(0);
  const [rowCountState, setRowCountState] = React.useState(
    customerCount || userCount || 0
  );
  const [rowCountStateManager, setRowCountStateManager] = React.useState(
    userCount || 0
  );

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      customerCount !== undefined ? customerCount : prevRowCountState
    );
  }, [customerCount, setRowCountState]);
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      userCount !== undefined ? userCount : prevRowCountState
    );
  }, [userCount, setRowCountState]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchUserData()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {});
  }, []);

  // rerender this component
  const handleRerender = () => {
    if (currentUser.role === 3) {
      fetchUsers(paginationModel.pageSize, paginationModel.page + 1)
        .then((res) => {
          setCustomerCount(res.data.count);

          setUsers(res.data.userList);
        })
        .catch((err) => {});
    } else if (currentUser.role === 4) {
      fetchAllStaffs(paginationModel.pageSize, paginationModel.page + 1)
        .then((res) => {
          setCustomerCount(res.data.count);
          setUsers(res.data.staffList);
        })
        .catch((err) => {});
    } else if (currentUser.role === 5) {
      fetchCustomer(paginationModel.pageSize, paginationModel.page + 1)
        .then((res) => {
          setCustomerCount(res.data.count);
          setCustomers(res.data.customerList);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      if (currentUser.role === 3) {
        fetchUsers(paginationModel.pageSize, paginationModel.page + 1)
          .then((res) => {
            setLoading(false);
            setCustomerCount(res.data.count);

            setUsers(res.data.userList);
          })
          .catch((err) => {});
      } else if (currentUser.role === 4) {
        fetchAllStaffs(paginationModel.pageSize, paginationModel.page + 1)
          .then((res) => {
            setLoading(false);
            setCustomerCount(res.data.count);
            setUsers(res.data.staffList);
          })
          .catch((err) => {});
      } else if (currentUser.role === 5) {
        fetchCustomer(paginationModel.pageSize, paginationModel.page + 1)
          .then((res) => {
            setLoading(false);

            setCustomerCount(res.data.count);
            setCustomers(res.data.customerList);
          })
          .catch((err) => {});
      }
    } catch (err) {
      return <Error />;
    }
  }, [paginationModel, currentUser.role]);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1 },

    { field: "phone", headerName: "SDT", flex: 1 },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: ({ row: { status } }) =>
        status === 1 ? (
          <Typography variant='h5' color={colors.greenAccent[400]}>
            Đang hoạt động
          </Typography>
        ) : (
          <Typography variant='h5' color={colors.primary[900]}>
            Đã khóa
          </Typography>
        ),
    },
    {
      field: "role",
      flex: 1,
      headerName: "Cấp bậc",
      renderCell: ({ row: { role } }) => {
        return (
          <Box>
            <Box
              flex={"1"}
              width={"150px"}
              m={"0 auto"}
              p={"5px"}
              display={"flex"}
              justifyContent={"flex-start"}
              gap={"10px"}
              backgroundColor={
                role === 3
                  ? colors.greenAccent[600]
                  : role === 4
                  ? colors.greenAccent[700]
                  : role === 5
                  ? colors.greenAccent[800]
                  : colors.greenAccent[900]
              }
              borderRadius={"4px"}>
              {role === 3 ? (
                <AdminPanelSettingsOutlined />
              ) : role === 4 ? (
                <SecurityOutlined />
              ) : role === 5 ? (
                <LockOpenOutlined />
              ) : (
                <Person2Outlined />
              )}

              {!isSmallScreen && (
                <Typography
                  color={colors.gray[100]}
                  sx={{
                    textTransform: "uppercase",
                  }}>
                  {role === 3
                    ? "Admin"
                    : role === 4
                    ? "Quản lý"
                    : role === 5
                    ? "Nhân viên"
                    : role === 1
                    ? "Người mua"
                    : role === 2
                    ? "Người bán"
                    : "Người dùng"}
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => (
        <ActionButtons row={params.row} handleRerender={handleRerender} />
      ),
    },
  ];

  {
    if (loading) {
      return (
        <Box>
          <Skeleton variant='rectangular' width={"100%"} height={50} />
        </Box>
      );
    }
    if (currentUser.role === 3 || currentUser.role === 4) {
      return users.length !== 0 ? (
        <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
          <Helmet>
            <title>Người dùng</title>
          </Helmet>
          <Header
            title={
              currentUser.role === 3
                ? "Người dùng"
                : currentUser.role === 4
                ? "Nhân viên"
                : currentUser.role === 5
                ? "Người dùng"
                : "Người dùng"
            }
            subTitle={"Danh sách người dùng"}
          />
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
              rows={users}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              rowCount={rowCountState}
              pageSizeOptions={[1, 3, 5]}
              paginationModel={paginationModel}
              paginationMode='server'
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Container>
      ) : (
        <NullBox
          header={"Không có người dùng để hiển thị"}
          navTo={"dashboard"}
          buttonText={"Bảng điều khiển"}
        />
      );
    } else if (currentUser.role === 5) {
      return users.length !== 0 ? (
        <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
          <Helmet>
            <title>Người dùng</title>
          </Helmet>
          <Header
            title={
              currentUser.role === 3
                ? "Người dùng"
                : currentUser.role === 4
                ? "Nhân viên"
                : currentUser.role === 5
                ? "Người dùng"
                : "Người dùng"
            }
            subTitle={"Danh sách người dùng"}
          />
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
              rows={customers}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              rowCount={rowCountState}
              pageSizeOptions={[1, 3, 5]}
              paginationModel={paginationModel}
              paginationMode='server'
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Container>
      ) : (
        <NullBox
          header={"Không có người dùng để hiển thị"}
          navTo={"dashboard"}
          buttonText={"Bảng điều khiển"}
        />
      );
    }
  }
};

export default Team;
