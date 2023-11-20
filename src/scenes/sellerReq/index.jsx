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
import { Helmet } from "react-helmet";

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
  }, [paginationModel]);

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
          <Button
            sx={{
              margin: "0 5px",
            }}
            variant='contained'
            color='error'
            onClick={() => handleReject(params.row.id)}>
            Từ chối
          </Button>
          <Button
            sx={{
              margin: "0 5px",
            }}
            variant='contained'
            color='success'
            onClick={() => handleApprove(params.row.id)}>
            Xác nhận
          </Button>
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
    </Container>
  );
};

export default SellerRequest;
