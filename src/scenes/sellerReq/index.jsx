import {
  Container,
  Box,
  Typography,
  Button,
  Icon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import ActionButtons from "../../components/ActionButtons";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { token } from "../../theme";
import { useEffect } from "react";
import {
  acceptSellerRequest,
  fetchSellerRequests,
  rejectSellerRequest,
} from "../../libs/requestServices";
import { useNavigate } from "react-router-dom";
import Error from "../../global/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import { Visibility } from "@mui/icons-material";
import { fetchSellerDetails, fetchUserDetails } from "../../libs/userService";

const SellerRequest = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [request, setRequest] = useState([]);
  const [reqCount, setReqCount] = useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCountState, setRowCountState] = React.useState(reqCount || 0);
  const [openViewUser, setOpenViewUser] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [userEmail, setUserEmail] = useState(null);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      reqCount !== undefined ? reqCount : prevRowCountState
    );
  }, [reqCount, setRowCountState]);
  useEffect(() => {
    fetchSellerRequests(paginationModel.pageSize, paginationModel.page + 1)
      .then((res) => {
        setRequest(res.data.list);
        setReqCount(res.data.count);
      })
      .catch((err) => {
        navigate("/error");
      });
  }, [paginationModel, request]);

  const handleApprove = (id) => {
    acceptSellerRequest(id)
      .then((res) => {
        toast.success("Phê duyệt thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchSellerRequests(paginationModel.pageSize, paginationModel.page + 1)
          .then((res) => {
            setRequest(res.data.list);
            setReqCount(res.data.count);
          })
          .catch((err) => {
            navigate("/error");
          });
      })
      .catch((err) => {
        return <Error />;
      });
  };

  const handleReject = (id) => {
    rejectSellerRequest(id)
      .then((res) => {
        toast.error("Đã từ chối", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchSellerRequests(paginationModel.pageSize, paginationModel.page + 1)
          .then((res) => {
            setRequest(res.data.list);
            setReqCount(res.data.count);
          })
          .catch((err) => {
            navigate("/error");
          });
      })
      .catch((err) => {
        return <Error />;
      });
  };

  const handleViewSellerDetails = (id) => {
    fetchSellerDetails(id)
      .then((res) => {
        setUserDetails(res.data);
        console.log("1");
        console.log(userDetails);
        setOpenViewUser(true);
      })
      .catch((err) => {});
  };

  const handleFetchUserDetails = (id) => {
    fetchUserDetails(id)
      .then((res) => {
        setUserEmail(res.data.email);
        console.log(userEmail);
      })
      .catch((err) => {});
  };

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
            Đang chờ duyệt
          </Typography>
        ) : (
          <Typography variant='h5' color={colors.red[400]}>
            Đã khóa
          </Typography>
        ),
    },

    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => {
              handleViewSellerDetails(params.row.id);
              handleFetchUserDetails(params.row.id);
            }}>
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Yêu cầu</title>
      </Helmet>
      <Header title='Yêu cầu trở thành người bán' />
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
        {reqCount === 0 ? (
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            gap={"20px"}
            alignItems={"center"}>
            <Typography variant='h4' fontWeight={"bold"}>
              Không có yêu cầu nào
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={() => navigate("/dashboard")}>
              Trở về trang chủ
            </Button>
          </Box>
        ) : (
          <DataGrid
            style={{
              fontSize: "18px",
            }}
            rows={request}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            rowCount={rowCountState}
            pageSizeOptions={[1, 3, 5]}
            paginationModel={paginationModel}
            paginationMode='server'
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Box>

      <Dialog
        fullWidth
        open={openViewUser}
        onClose={() => {
          setOpenViewUser(false);
        }}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'>
        <DialogTitle id='scroll-dialog-title' variant='h4'>
          Thông tin của {userDetails.name}
        </DialogTitle>
        <DialogContent>
          <Box id='scroll-dialog-description' tabIndex={-1}>
            {/* Display user details here */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              // alignItems={"center"}
              gap={"20px"}>
              {/* left */}
              <Box padding={"10px"}>
                <Box
                  width={"200px"}
                  height={"200px"}
                  sx={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    objectFit: "contain",
                  }}>
                  <img
                    width={"100%"}
                    height={"100%"}
                    src={userDetails.profilePicture}
                  />
                </Box>
              </Box>
              {/* right */}
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                flexDirection={"column"}>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Tên
                  </Typography>
                  <Typography variant='h5'>{userDetails.name}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Email
                  </Typography>
                  <Typography variant='h5'>{userEmail}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    SDT
                  </Typography>
                  <Typography variant='h5'>{userDetails.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Địa chỉ
                  </Typography>
                  <Typography variant='h5'>
                    {userDetails.street}, {userDetails.ward},{" "}
                    {userDetails.district}, {userDetails.province}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Cấp bậc
                  </Typography>
                  <Typography variant='h5'>
                    {userDetails.role === 1
                      ? "Người mua"
                      : userDetails.role === 2
                      ? "Người bán"
                      : "Người dùng"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Add more user details as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              margin: "0 5px",
            }}
            variant='contained'
            color='error'
            onClick={() => {
              handleReject(userDetails.id);
              setOpenViewUser(false);
            }}>
            Từ chối
          </Button>
          <Button
            sx={{
              margin: "0 5px",
            }}
            variant='contained'
            color='success'
            onClick={() => {
              handleApprove(userDetails.id);
              setOpenViewUser(false);
            }}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerRequest;
