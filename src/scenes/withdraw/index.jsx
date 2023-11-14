import { Container, Box, Typography, Button } from "@mui/material";
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
import {
  fetchAllWithdrawRequest,
  handleWithdrawRequest,
} from "../../libs/userService";
import { formatPrice } from "../../libs/formaters";
import { fetchUserData } from "../../libs/accountServices";

const Withdraw = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const approve = 2;
  const reject = 3;
  const [request, setRequest] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [requestCount, setRequestCount] = React.useState(0);

  const [rowCountState, setRowCountState] = React.useState(requestCount || 0);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      requestCount !== undefined ? requestCount : prevRowCountState
    );
  }, [requestCount, setRowCountState]);

  useEffect(() => {
    fetchAllWithdrawRequest(paginationModel.pageSize, paginationModel.page)
      .then((res) => {
        console.log(res.data);
        setRequestCount(res.data.length);
        setRequest(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate("/error");
      });
    fetchUserData()
      .then((res) => {
        console.log(res.data);
        setCurrentUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate("/error");
      });
  }, [paginationModel]);

  const handleApprove = (id, status) => {
    console.log("ID");
    console.log(id);
    handleWithdrawRequest(id, status)
      .then((res) => {
        console.log("ID");
        console.log(id);
        console.log(res.data);
        toast.success("Đã xác nhận", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchAllWithdrawRequest(paginationModel.pageSize, paginationModel.page)
          .then((res) => {
            console.log(res.data);
            setRequest(res.data);
          })
          .catch((err) => {
            console.log(err);
            navigate("/error");
          });
      })
      .catch((err) => {
        console.log(err);
        return <Error />;
      });
  };

  const handleReject = (id, status) => {
    handleWithdrawRequest(id, status)
      .then((res) => {
        console.log("ID");
        console.log(id);
        console.log(res.data);
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
        fetchAllWithdrawRequest(paginationModel.pageSize, paginationModel.page)
          .then((res) => {
            console.log(res.data);
            setRequest(res.data);
          })
          .catch((err) => {
            console.log(err);
            navigate("/error");
          });
      })
      .catch((err) => {
        console.log(err);
        return <Error />;
      });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "managerName",
      headerName: "Tên quản lí",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { managerName } }) => managerName || "Chưa có",
    },
    {
      field: "amount",
      headerName: "Số tiền",
      flex: 1,
      renderCell: ({ row: { amount } }) => formatPrice(amount),
    },

    { field: "bank", headerName: "Ngân hàng", flex: 1 },
    { field: "bankNumber", headerName: "Số tài khoản", flex: 1 },

    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: ({ row: { status } }) =>
        status === 1 ? (
          <Typography variant='h5' color={colors.greenAccent[400]}>
            Đang chờ duyệt
          </Typography>
        ) : status === 2 ? (
          <Typography variant='h5' color={colors.blueAccent[400]}>
            Được duyệt
          </Typography>
        ) : (
          <Typography variant='h5' color={colors.redAccent[400]}>
            Đã từ chối
          </Typography>
        ),
    },

    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) =>
        params.row.status === 1 && (
          <Box>
            <Button
              sx={{
                margin: "0 5px",
              }}
              variant='contained'
              color='error'
              onClick={() => handleReject(params.row.id, reject)}>
              Từ chối
            </Button>
            <Button
              sx={{
                margin: "0 5px",
              }}
              variant='contained'
              color='success'
              onClick={() => handleApprove(params.row.id, approve)}>
              Xác nhận
            </Button>
          </Box>
        ),
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Header title='Rút tiền về tài khoản' />
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
          rows={request}
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
  );
};

export default Withdraw;
