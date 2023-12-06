import React, { useContext } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
  Skeleton,
  Chip,
} from "@mui/material";
import List from "@mui/icons-material/List";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataAuctions } from "../../data/mockData";
import StaffChooser from "../../components/StaffChooser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffChooserModal from "../../components/StaffChooser/index_1";
import { Visibility } from "@mui/icons-material";
import { useEffect } from "react";
import {
  fetchAuctions,
  fetchAuctionDetail,
  fetchStaffAuctions,
} from "../../libs/auctionService";
import { formatPrice, formatDateTime } from "../../libs/formaters";
import { fetchUserData } from "../../libs/accountServices";
import Error from "../../global/Error";
import { SignalRContext } from "../../context/SignalRContext";
import { Helmet } from "react-helmet";
import NullBox from "../../components/NullBox";

const Auction = ({ userId }) => {
  const navigate = useNavigate();
  const [isOpenChooser, setIsOpenChooser] = useState(false);
  const [isOpenViewAuction, setIsOpenViewAuction] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({}); // State to store auction details
  const [auctions, setAuctions] = useState([]); // State to store auction details
  const [auctionCount, setAuctionCount] = useState(0); // State to store auction details
  const [currentUser, setCurrentUser] = useState({}); // State to store current user details
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCountState, setRowCountState] = React.useState(auctionCount || 0);
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  // Signal R context
  const signalRContext = useContext(SignalRContext);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      auctionCount !== undefined ? auctionCount : prevRowCountState
    );
  }, [auctionCount, setRowCountState]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {});

    if (signalRContext?.connection) {
      signalRContext.connection.on("ReceiveAuctionOpen", (auctionTitle) => {
        getAuctionByStaff();
      });

      signalRContext.connection.on("ReceiveAuctionEnd", (auctionTitle) => {
        getAuctionByStaff();
      });

      signalRContext.connection.on(
        "ReceiveAuctionAssigned",
        (auctionId, auctionTitle) => {
          getAuctionByStaff();
        }
      );
    }
  }, []);

  function getAuctionByStaff() {
    fetchStaffAuctions(paginationModel.pageSize, paginationModel.page)
      .then((res) => {
        setAuctionCount(res.data.count);
        setAuctions(res.data.auctionList);
        setIsLoading(false); // Set isLoading to false when data is loaded
      })
      .catch((err) => {
        setIsLoading(false); // Set isLoading to false on error as well
      });
  }

  useEffect(() => {
    getAuctionByStaff();
    return () => {
      setAuctions([]);
    };
  }, [paginationModel]);

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Chưa có nhân viên";
      case 2:
        return "Cập nhật thông tin";
      case 0:
        return "Đang chờ duyệt";
      case 3:
        return "Bị từ chối";
      case 4:
        return "Mở đăng ký";
      case 5:
        return "Đang diễn ra";
      case 6:
        return "Đã kết thúc";
      case 7:
        return "Bán không thành công";
      case 8:
        return "Đã hủy";
      default:
        return "Đang cập nhật";
    }
  };

  const handleViewAuction = (auctionId, status) => {
    // if (status === 2) {
    //   navigate(`/approveAuction/${auctionId}`);
    // }
    navigate(`/auction/${auctionId}`);
  };
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "title",
      headerName: "Tên",
      flex: 1,
      cellClassName: "auctionName-column--cell",
    },
    {
      field: "entryFee",
      headerName: "Phí tham dự",
      flex: 1,
      cellClassName: "staffName-column--cell",
      valueFormatter: (params) => {
        // Use the formatPrice function to format the value
        return formatPrice(params.value);
      },
    },
    {
      field: "startingPrice",
      headerName: "Giá khởi điểm",
      flex: 1,
      cellClassName: "staffName-column--cell",
      valueFormatter: (params) => {
        // Use the formatPrice function to format the value
        return formatPrice(params.value);
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 2,
      cellClassName: "status-column--cell",
      valueGetter: (params) => getStatusText(params.value),
      renderCell: (params) => (
        <Chip
          sx={{ textTransform: "uppercase", fontSize: "1rem" }}
          label={
            params.row.status === 1
              ? "Chưa có nhân viên"
              : params.row.status === 2
              ? "Cập nhật thông tin"
              : params.row.status === 0
              ? "Đang chờ duyệt"
              : params.row.status === 3
              ? "Bị từ chối"
              : params.row.status === 4
              ? "Mở đăng ký"
              : params.row.status === 5
              ? "Đang diễn ra"
              : params.row.status === 6
              ? "Đã kết thúc"
              : params.row.status === 7
              ? "Bán không thành công"
              : "Đang cập nhật"
          }
          color={
            params.row.status === 1
              ? "info"
              : params.row.status === 2
              ? "warning"
              : params.row.status === 0
              ? "warning"
              : params.row.status === 3
              ? "error"
              : params.row.status === 4
              ? "info"
              : params.row.status === 5
              ? "success"
              : params.row.status === 6
              ? "error"
              : params.row.status === 7
              ? "secondary"
              : "warning"
          }
        />
      ),
    },

    {
      field: "startedAt",
      headerName: "Ngày bắt đầu",
      flex: 1,
      cellClassName: "auctionName-column--cell",
      valueFormatter: (params) => {
        // Use the formatDateTime function to format the date-time value
        return formatDateTime(params.value);
      },
    },
    {
      field: "endedAt",
      headerName: "Ngày kết thúc",
      flex: 1,
      cellClassName: "auctionName-column--cell",
      valueFormatter: (params) => {
        // Use the formatDateTime function to format the date-time value
        return formatDateTime(params.value);
      },
    },

    {
      field: "assignStaff",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color={colors.primary[400]}
            onClick={() => handleViewAuction(params.row.id, params.row.status)}>
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  return auctions != null ? (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Đấu giá</title>
      </Helmet>
      <Box position={"relative"}>
        {isOpenChooser && (
          <StaffChooserModal
            isOpenChooser={isOpenChooser}
            setIsOpenChooser={setIsOpenChooser}
          />
        )}

        <Header
          title={"Các buổi đấu giá"}
          subTitle={"Danh sách các buổi đấu giá"}
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
            "& .auctionName-column--cell": {
              color: colors.primary[300],
            },
            "& .status-column--cell": {},
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
          {isLoading ? (
            <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
              {" "}
              <Skeleton
                variant='rectangular'
                width={"100%"}
                height={500}
                animation='wave'
              />
            </Container>
          ) : (
            // Display the DataGrid when data is available
            <DataGrid
              style={{
                fontSize: "18px",
              }}
              rows={auctions}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              rowCount={rowCountState}
              loading={isLoading}
              pageSizeOptions={[3, 5, 10]}
              paginationModel={paginationModel}
              paginationMode='server'
              onPaginationModelChange={setPaginationModel}
            />
          )}
        </Box>
      </Box>
    </Container>
  ) : (
    <NullBox
      header={"Bạn chưa được phân công đấu giá"}
      navTo={"dashboard"}
      buttonText={"bảng điều khiển"}
    />
  );
};

export default Auction;
