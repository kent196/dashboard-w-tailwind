import { useTheme } from "@emotion/react";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import ProductDetailModal from "../../components/ProductDetailModal";
import StaffChooser from "../../components/StaffChooser";
import StaffChooserModal from "../../components/StaffChooser/index_1";
import Unauthorize from "../../global/Unauthorize";
import { fetchUserData } from "../../libs/accountServices";
import {
  addStaffToHost,
  fetchAuctionDetail,
  fetchAuctionRegisters,
  fetchAuctions,
  fetchBidders,
  managerApproval,
  managerReject,
} from "../../libs/auctionService";
import { formatDateTime, formatPrice } from "../../libs/formaters";
import { fetchProduct } from "../../libs/productServices";
import { token } from "../../theme";
import RegistrationList from "../../components/AuctionRegisList";
import { Helmet } from "react-helmet";
import NullBox from "../../components/NullBox";

const AuctionManager = () => {
  const navigate = useNavigate();
  const [isOpenChooser, setIsOpenChooser] = useState(false);
  const [isOpenViewAuction, setIsOpenViewAuction] = useState(false);
  const [bidders, setBidders] = useState([]);
  const [isStaffChooserOpen, setIsStaffChooserOpen] = useState(false);
  const registerPageSize = 100;
  const [isOpenViewBidders, setIsOpenViewBidders] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({}); // State to store auction details
  const [auctions, setAuctions] = useState([]); // State to store auction details
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [rerender, setRerender] = useState(false);
  const [isOpenRegisList, setIsOpenRegisList] = useState(false);
  const [regisList, setRegisList] = useState([]); // State to store auction details
  const [auctionsCount, setAuctionsCount] = useState(); // State to store auction details
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCountState, setRowCountState] = React.useState(auctionsCount || 0);
  const bidderPageSize = 100;

  const { id } = useParams();

  const [user, setUser] = useState({}); // State to store user details
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      auctionsCount !== undefined ? auctionsCount : prevRowCountState
    );
  }, [auctionsCount, setRowCountState]);

  const handleRerender = () => {
    setRerender(!rerender);
  };

  const handleOpenRegisList = (auctionId) => {
    fetchAuctionRegisters(auctionId, registerPageSize)
      .then((res) => {
        setRegisList(res.data);
        setIsOpenRegisList(true);
      })
      .catch((err) => {});
  };

  // useEffect(() => {
  //   fetchAuctionRegisters(auctionDetails.id)
  //     .then((res) => {
  //       setRegisList(res.data);
  //     })
  //     .catch((err) => {
  //     });
  //   return () => {
  //     setRegisList([]);
  //   };
  // }, []);

  const handleApprove = (auctionId) => {
    managerApproval(auctionId)
      .then((res) => {
        fetchAuctionDetail(auctionId).then((res) => {
          setAuctionDetails(res.data);
        });
        fetchAuctions().then((res) => {
          setAuctions(res.data.auctionList);
        });
      })
      .catch((err) => {
        navigate("/error");
      });
  };

  const handleReject = (auctionId) => {
    managerReject(auctionId)
      .then((res) => {
        fetchAuctionDetail(auctionId).then((res) => {
          setAuctionDetails(res.data);
        });
        fetchAuctions().then((res) => {
          setAuctions(res.data.auctionList);
        });
      })
      .catch((err) => {
        navigate("/error");
      });
  };

  const handleViewProduct = (productId) => {
    // Set isLoadingProductDetails to true when loading starts
    setIsLoading(true);
    // Fetch product details
    fetchProduct(productId)
      .then((res) => {
        setProductDetails(res.data);
        // Set isLoadingProductDetails to false when loading is complete
        setIsLoading(false);
      })
      .catch((err) => {
        // Set isLoadingProductDetails to false on error as well
        setIsLoading(false);
      });
    setIsOpenProductDetail(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchBidders(id, bidderPageSize)
      .then((res) => {
        setBidders(res.data);
      })
      .catch((err) => {});
    return () => {
      setBidders([]);
    };
  }, []);

  useEffect(() => {
    fetchUserData()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {});
  }, []);

  const handleAssignStaff = (auctionId, staffId) => {
    addStaffToHost(auctionId, staffId)
      .then((res) => {
        fetchAuctionDetail(auctionId).then((res) => {
          setAuctionDetails(res.data);
        });
        fetchAuctions().then((res) => {
          setAuctions(res.data.auctionList);
        });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchAuctions(paginationModel.pageSize, paginationModel.page)
      .then((res) => {
        setAuctionsCount(res.data.count);
        setAuctions(res.data.auctionList);
        setIsLoading(false); // Set isLoading to false when data is loaded
      })
      .catch((err) => {
        setIsLoading(false); // Set isLoading to false on error as well
      });
    return () => {
      // setAuctions([]);
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

  const handleFetchBidders = (auctionId) => {
    fetchBidders(auctionId, bidderPageSize)
      .then((res) => {
        setBidders(res.data);
      })
      .catch((err) => {});
  };

  const handleFetchRegisters = (auctionId) => {
    fetchAuctionRegisters(auctionId, registerPageSize)
      .then((res) => {
        setRegisList(res.data);
      })
      .catch((err) => {});
  };

  const handleViewAuction = (auctionId) => {
    fetchAuctionDetail(auctionId)
      .then((res) => {
        setAuctionDetails(res.data);
        setIsOpenViewAuction(true);
      })
      .catch((err) => {});
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
      cellClassName: "staffName-column--cell",
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
            onClick={() => handleViewAuction(params.row.id)}>
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  {
    if (user.role === 4) {
      return auctions != null ? (
        <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
          <Helmet>
            <title>Đấu giá</title>
          </Helmet>
          <Box position={"relative"}>
            {isOpenChooser && (
              <StaffChooserModal
                rerender={handleAssignStaff}
                auctionId={auctionDetails.id}
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
                  // loading={isLoading}
                  pageSizeOptions={[1, 2, 3, 10]}
                  paginationModel={paginationModel}
                  paginationMode='server'
                  onPaginationModelChange={setPaginationModel}
                />
              )}
            </Box>
          </Box>

          {/* View auction details */}
          <Dialog
            maxWidth={"xl"}
            open={isOpenViewAuction}
            onClose={() => setIsOpenViewAuction(false)}
            aria-labelledby='scroll-dialog-title'
            aria-describedby='scroll-dialog-description'>
            <DialogTitle id='scroll-dialog-title' variant='h4'>
              Chi tiết buổi đấu giá
            </DialogTitle>
            <DialogContent>
              <Box>
                {isStaffChooserOpen && (
                  <StaffChooser
                    isOpenChooser={isStaffChooserOpen}
                    setIsOpenChooser={setIsStaffChooserOpen}
                  />
                )}

                <Box>
                  <Header title={auctionDetails.title} />
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={"30px"}
                  width={"100%"}>
                  {/* left */}
                  <Box width={"60%"}>
                    <Box
                      display={"flex"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      gap={"20px"}
                      m={"30px 0"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Trạng thái:
                      </Typography>
                      <Chip
                        sx={{ textTransform: "uppercase", fontSize: "1rem" }}
                        label={
                          auctionDetails.status === 1
                            ? "Chưa có nhân viên"
                            : auctionDetails.status === 0
                            ? "Đang chờ duyệt"
                            : auctionDetails.status === 2
                            ? "Cập nhật thông tin"
                            : auctionDetails.status === 3
                            ? "Bị từ chối"
                            : auctionDetails.status === 4
                            ? "Mở đăng ký"
                            : auctionDetails.status === 5
                            ? "Đang diễn ra"
                            : auctionDetails.status === 6
                            ? "Đã kết thúc"
                            : auctionDetails.status === 7
                            ? "Không thành công"
                            : "Đang cập nhật"
                        }
                        color={
                          auctionDetails.status === 1
                            ? "info"
                            : auctionDetails.status === 0
                            ? "warning"
                            : auctionDetails.status === 2
                            ? "warning"
                            : auctionDetails.status === 3
                            ? "error"
                            : auctionDetails.status === 4
                            ? "info"
                            : auctionDetails.status === 5
                            ? "success"
                            : auctionDetails.status === 6
                            ? "error"
                            : auctionDetails.status === 7
                            ? "secondary"
                            : "warning"
                        }
                      />
                    </Box>
                    {/* Time */}
                    {auctionDetails.status === 5 && (
                      <Box>
                        <Box
                          alignItems={"center"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
                          <Typography fontWeight={"bold"} variant={"h5"}>
                            Bắt đầu:
                          </Typography>

                          <Typography variant='h5'>
                            {formatDateTime(auctionDetails.startedAt)}
                          </Typography>
                        </Box>
                        <Box
                          alignItems={"center"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
                          <Typography fontWeight={"bold"} variant={"h5"}>
                            Kết thúc:
                          </Typography>

                          <Typography variant='h5'>
                            {formatDateTime(auctionDetails.endedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {/* Dash */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "black",
                        margin: "20px 0",
                      }}></Box>
                    {/* Price */}
                    <Box>
                      {auctionDetails.status != 1 &&
                        auctionDetails.status != 2 &&
                        auctionDetails.status != 3 &&
                        auctionDetails.status != 4 &&
                        auctionDetails.status != 0 && (
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            m={"10px 0"}>
                            <Typography fontWeight={"bold"} variant={"h5"}>
                              Giá cao nhất:
                            </Typography>
                            <Typography variant={"h5"}>
                              {formatPrice(auctionDetails.currentPrice)}
                            </Typography>
                          </Box>
                        )}
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Giá khởi điểm:
                        </Typography>
                        <Typography variant={"h5"}>
                          {formatPrice(auctionDetails.startingPrice)}
                        </Typography>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Bước giá:
                        </Typography>
                        <Typography variant={"h5"}>
                          {formatPrice(auctionDetails.step)}
                        </Typography>
                      </Box>
                      {auctionDetails.status === 5 && (
                        <Box display={"flex"} gap={"10px"}>
                          <Box flex={"1"}>
                            <Box
                              display={"flex"}
                              justifyContent={"space-between"}
                              m={"10px 0"}>
                              <Typography fontWeight={"bold"} variant={"h5"}>
                                Số người tham gia:
                              </Typography>
                              <Typography variant={"h5"}>
                                {auctionDetails.numberOfBidders}
                              </Typography>
                            </Box>
                            <Box
                              display={"flex"}
                              justifyContent={"space-between"}
                              m={"10px 0"}>
                              <Typography fontWeight={"bold"} variant={"h5"}>
                                Số lượt đấu giá:
                              </Typography>
                              <Typography variant={"h5"}>
                                {auctionDetails.numberOfBids}
                              </Typography>
                            </Box>
                            <Box
                              m={"10px 0"}
                              display={"flex"}
                              justifyContent={"flex-end"}>
                              <Button
                                variant={"outlined"}
                                color={"primary"}
                                onClick={() => {
                                  setIsOpenViewBidders(true);
                                  handleFetchBidders(auctionDetails.id);
                                }}>
                                Xem chi tiết
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    {/* Dash */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "black",
                        margin: "20px 0",
                      }}></Box>
                    {/* Staff */}
                    <Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Nhân viên:
                        </Typography>
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"right"}>
                          <Typography
                            textAlign={"right"}
                            mb={"10px"}
                            variant={"h5"}>
                            {auctionDetails.staffName === null
                              ? "Chưa có nhân viên"
                              : auctionDetails.staffName}
                          </Typography>
                          {(auctionDetails.status === 1 ||
                            auctionDetails.status === 2) && (
                              <Button
                                sx={{ minWidth: "100px", height: "50px" }}
                                variant='contained'
                                color='primary'
                                onClick={() =>
                                  setIsOpenChooser(!isOpenChooser)
                                }>
                                Chọn nhân viên
                              </Button>
                            )}
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      m={"10px 0"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Người bán:
                      </Typography>
                      <Typography variant={"h5"}>
                        {auctionDetails.seller?.name}
                      </Typography>
                    </Box>
                  </Box>
                  {/* right */}
                  <Box width={"40%"}>
                    <Box
                      display={"flex"}
                      justifyContent={"flex-end"}
                      mb={"20px"}>
                      <img
                        style={{
                          width: "300px",
                          height: "300px",
                        }}
                        src={auctionDetails.imageUrls}
                      />
                    </Box>
                    <Box m={"10px 0"} textAlign={"right"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Tên sản phẩm
                      </Typography>
                      <Typography variant={"h4"}>
                        {auctionDetails.product?.name}
                      </Typography>
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                      <Button
                        variant='outlined'
                        onClick={() =>
                          handleViewProduct(auctionDetails.product.id)
                        }>
                        Xem chi tiết
                      </Button>
                    </Box>
                    {auctionDetails.status === 4 && (
                      <Box
                        m={"10px 0"}
                        display={"flex"}
                        justifyContent={"flex-end"}>
                        <Button
                          variant={"outlined"}
                          color={"primary"}
                          onClick={() => {
                            handleOpenRegisList(auctionDetails.id);
                            handleFetchRegisters(auctionDetails.id);
                          }}>
                          Xem danh sách đăng ký
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              {/* Button */}
              {auctionDetails.status === 0 && (
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  gap={"20px"}
                  m={"20px 0"}
                  mr={"20px"}>
                  <Button
                    sx={{ width: "100px" }}
                    variant='contained'
                    color='error'
                    onClick={() => handleReject(auctionDetails.id)}>
                    Từ chối
                  </Button>
                  <Button
                    sx={{ width: "100px" }}
                    variant='contained'
                    color='success'
                    onClick={() => handleApprove(auctionDetails.id)}>
                    Duyệt
                  </Button>
                </Box>
              )}
            </DialogActions>
          </Dialog>

          {/* View bidders */}
          <Dialog
            fullWidth
            sx={{
              maxHeight: "70vh",
              margin: "50px 0",
            }}
            open={isOpenViewBidders}
            onClose={() => {
              setIsOpenViewBidders(false);
              setBidders([]);
            }}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'>
            <DialogTitle>
              Số người tham gia: {auctionDetails.numberOfBidders} <br /> Số lượt
              bid: {auctionDetails.numberOfBids}
            </DialogTitle>
            <DialogContent>
              {bidders.map((bidder, index) => (
                <Box
                  key={bidder.bidAmount}
                  m='10px 0'
                  style={{
                    backgroundColor:
                      index === 0
                        ? "yellow"
                        : bidder.status === 1
                        ? "transparent"
                        : "#e7e9eb", // Highlight the first bidder
                    padding: "10px",
                    color: bidder.status === 1 ? "black" : "gray",
                  }}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h5'>{bidder.bidder.name}</Typography>
                    <Typography variant='h5'>
                      {formatPrice(bidder.bidAmount)}
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h5'>
                      {new Date(bidder.bidDate).toLocaleString()}
                    </Typography>
                    <Typography variant='h5'>
                      {bidder.status === 1 ? "Hợp lệ" : "Đã rút"}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </DialogContent>
          </Dialog>

          {/* View register list */}
          <RegistrationList
            isOpenRegisList={isOpenRegisList}
            setIsOpenRegisList={setIsOpenRegisList}
            regisList={regisList}
          />

          {/* View Product Details */}
          <ProductDetailModal
            isLoadingProductDetails={isLoading}
            isOpenProductDetail={isOpenProductDetail}
            productDetails={productDetails}
            auction={auctionDetails}
            setIsOpenProductDetail={setIsOpenProductDetail}
          />
        </Container>
      ) : (
        <NullBox
          header={"Không có buổi đấu giá nào được tạo"}
          navTo={"dashboard"}
          buttonText={"bảng diều khiển"}
        />
      );
    } else
      return (
        !isLoading && (
          <Box>
            <Unauthorize />
          </Box>
        )
      );
  }
};

export default AuctionManager;
