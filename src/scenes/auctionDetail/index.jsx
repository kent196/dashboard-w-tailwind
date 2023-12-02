// AuctionDetail.js
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SnackBar from "@mui/material/Snackbar";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import ProductDetailModal from "../../components/ProductDetailModal";
import StaffChooser from "../../components/StaffChooser";
import Error from "../../global/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  auctionReject,
  fetchAuctionDetail,
  fetchAuctionRegisters,
  fetchBidders,
  updateAuctionInfo,
} from "../../libs/auctionService";
import { formatPrice } from "../../libs/formaters";
import { fetchProduct } from "../../libs/productServices";
import { token } from "../../theme";
import RegistrationList from "../../components/AuctionRegisList";
import { ToastContainer } from "react-toastify";
import { SignalRContext } from "../../context/SignalRContext";
import { Helmet } from "react-helmet";

const AuctionDetail = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const registerPageSize = 100;
  const [auction, setAuction] = useState(null); // State to store auction details
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);
  const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [isStaffChooserOpen, setIsStaffChooserOpen] = useState(false);
  const [isOpenViewBidders, setIsOpenViewBidders] = useState(false);
  const [bidders, setBidders] = useState([]); // State to store auction details
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedRegisStart, setSelectedRegisStart] = useState(new Date());
  const [selectedRegisEnd, setSelectedRegisEnd] = useState(new Date());
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isOpenRegisList, setIsOpenRegisList] = useState(false);
  const [isLoadingAuctionDetail, setIsLoadingAuctionDetail] = useState(false);
  const [regisList, setRegisList] = useState([]); // State to store auction details
  const [formData, setFormData] = useState({
    // startedAt: "",
    // endedAt: "",
    // registrationStart: "",
    // registrationEnd: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const bidderPageSize = 100;

  // Signal R context
  const signalRContext = useContext(SignalRContext);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  // Access the 'id' from the URL parameter
  const { id } = useParams();

  const handleAuctionApproval = (auctionId, formData) => {
    updateAuctionInfo(auctionId, formData)
      .then((res) => {
        setAuction(res.data);
        setErrorMsg("");
        // Display a success toast
        toast.success("Cập nhật thông tin thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchAuctionDetail(id)
          .then((res) => {
            window.scrollTo(0, 0);

            setAuction(res.data);
          })
          .catch((err) => {
            setErrorMsg(err.response.data.message);
            console.log(errorMsg);
          });
        // navigate(`/auctions`);
      })
      .catch((err) => {
        toast.error("Thông tin cập nhật chưa hợp lệ", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setErrorMsg(err.response.data.message);
        console.log(errorMsg);
      });
  };

  const handleNavigateToLive = (auctionId) => {
    navigate(`/auction/live/${auctionId}`);
  };

  const handleAuctionReject = (auctionId) => {
    auctionReject(auctionId)
      .then((res) => {
        setAuction(res.data);
        navigate(`/auctions`);
      })
      .catch((err) => {});
  };

  const handleViewProduct = (productId) => {
    // Set isLoadingProductDetails to true when loading starts
    setIsLoadingProductDetails(true);
    // Fetch product details
    fetchProduct(productId)
      .then((res) => {
        setProductDetails(res.data);
        // Set isLoadingProductDetails to false when loading is complete
        setIsLoadingProductDetails(false);
      })
      .catch((err) => {
        // Set isLoadingProductDetails to false on error as well
        setIsLoadingProductDetails(false);
      });
    setIsOpenProductDetail(true);
  };

  const handleFetchBidders = (auctionId) => {
    fetchBidders(auctionId, bidderPageSize)
      .then((res) => {
        setBidders(res.data);
      })
      .catch((err) => {});
  };

  // useEffect(() => {
  //   fetchBidders(id)
  //     .then((res) => {
  //       setBidders(res.data);
  //     })
  //     .catch((err) => {
  //     });
  //   return () => {
  //     setBidders([]);
  //   };
  // }, []);

  function getAuctionDetail() {
    setIsLoadingAuctionDetail(true);
    fetchAuctionDetail(id)
      .then((res) => {
        setAuction(res.data);
        setSelectedStartDate(res.data.startedAt);
        setSelectedEndDate(res.data.endedAt);
        setSelectedRegisStart(res.data.registrationStart);
        setSelectedRegisEnd(res.data.registrationEnd);
        setFormData({
          startedAt: res.data.startedAt,
          endedAt: res.data.endedAt,
          registrationStart: res.data.registrationStart,
          registrationEnd: res.data.registrationEnd,
        });
      })
      .catch((err) => {
        return <Error />;
      })
      .finally(() => {
        setIsLoadingAuctionDetail(false);
      });
  }

  function openRegistrationList() {
    fetchAuctionRegisters(id, registerPageSize)
      .then((res) => {
        setRegisList(res.data);
      })
      .catch((err) => {});
    setIsOpenRegisList(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    getAuctionDetail();

    if (signalRContext?.connection) {
      signalRContext.connection.on("ReceiveAuctionOpen", (auctionTitle) => {
        getAuctionDetail();
      });

      signalRContext.connection.on("ReceiveAuctionEnd", (auctionTitle) => {
        getAuctionDetail();
      });
    }
    return () => {
      setAuction(null);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setSelectedRegisStart(null);
      setSelectedRegisEnd(null);
    };
  }, []);
  if (auction === null) {
    return (
      <Skeleton
        variant='rectangular'
        animation='wave'
        width='100%'
        height={"70vh"} // Adjust the height according to your needs
      />
    ); // Show loading indicator when auction is null
  } else if (isLoadingAuctionDetail) {
    <Skeleton
      variant='rectangular'
      animation='wave'
      width='100%'
      height={"70vh"} // Adjust the height according to your needs
    />;
  } else if (
    auction.status === 1 ||
    auction.status === 2 ||
    auction.status === 3 ||
    auction.status === 4 ||
    auction.status === 7
  ) {
    return (
      <Container
        maxWidth='xl'
        sx={{ padding: "0 !important", paddingTop: "20px" }}>
        <Helmet>
          <title>Chi tiết đấu giá</title>
        </Helmet>
        {auction && (
          <>
            {/* <Box
              display={"flex"}
              justifyContent={"flex-start"}
              gap={"20px"}
              flex={"1"}
              alignItems={"center"}
              mb={"30px"}></Box> */}
            <Box display={"flex"} justifyContent={"center"}>
              <Box
                // maxHeight={"100vh"}
                display={"flex"}
                justifyContent={"space-evenly"}
                width={"80%"}
                gap={"20px"}>
                {isStaffChooserOpen && (
                  <StaffChooser
                    isOpenChooser={isStaffChooserOpen}
                    setIsOpenChooser={setIsStaffChooserOpen}
                  />
                )}

                {/* Left */}
                <Box
                  width={"70%"}
                  // height={"80vh"}
                  boxShadow={2}
                  display={"flex"}
                  flexDirection={"column"}
                  // justifyContent={"space-between"}

                  p={"0 20px"}
                  // gap={"10px"}
                  sx={{
                    backgroundColor: "white",
                  }}>
                  {/* Details */}
                  <Header margin={"20px"} title={`${auction.title}`} />

                  <Box
                    height={"10%"}
                    display={"flex"}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    gap={"20px"}
                    m={"10px 0"}>
                    <Typography fontWeight={"bold"} variant={"h5"}>
                      Trạng thái:
                    </Typography>
                    <Chip
                      sx={{ textTransform: "uppercase", fontSize: "1rem" }}
                      label={
                        auction.status === 1
                          ? "Chưa có nhân viên"
                          : auction.status === 0
                          ? "Đang chờ duyệt"
                          : auction.status === 2
                          ? "Cập nhật thông tin"
                          : auction.status === 3
                          ? "Bị từ chối"
                          : auction.status === 4
                          ? "Mở đăng ký"
                          : auction.status === 5
                          ? "Đang diễn ra"
                          : auction.status === 6
                          ? "Đã kết thúc"
                          : auction.status === 7
                          ? "Không thành công"
                          : "Đang cập nhật"
                      }
                      color={
                        auction.status === 1
                          ? "info"
                          : auction.status === 0
                          ? "warning"
                          : auction.status === 2
                          ? "warning"
                          : auction.status === 3
                          ? "error"
                          : auction.status === 4
                          ? "info"
                          : auction.status === 5
                          ? "success"
                          : auction.status === 6
                          ? "error"
                          : auction.status === 7
                          ? "secondary"
                          : "warning"
                      }
                    />
                  </Box>
                  {/* Time */}
                  {auction.status != 0 && (
                    <Box
                      // height={"50%"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"space-between"}
                      p={"10px 0"}>
                      <Box
                        height={"20%"}
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          width={"150px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Mở đăng kí:
                        </Typography>

                        {auction.status === 2 ||
                        auction.status === 4 ||
                        auction.status === 7 ? (
                          <TextField
                            sx={{
                              maxWidth: "200px",
                            }}
                            id='startDate'
                            type='datetime-local'
                            name='registrationStart'
                            // defaultValue={auction.startedAt}
                            defaultValue={
                              auction.registrationStart || new Date()
                            }
                            onChange={handleInputChange}
                          />
                        ) : (
                          <Typography variant={"h5"}>
                            {auction.registrationStart
                              ? new Date(
                                  auction.registrationStart
                                ).toLocaleString()
                              : null}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        height={"20%"}
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          width={"150px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Đóng đăng kí:
                        </Typography>

                        {auction.status === 2 ||
                        auction.status === 4 ||
                        auction.status === 7 ? (
                          <TextField
                            sx={{
                              maxWidth: "200px",
                            }}
                            id='startDate'
                            type='datetime-local'
                            name='registrationEnd'
                            // defaultValue={auction.startedAt}
                            defaultValue={auction.registrationEnd || new Date()}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <Typography variant={"h5"}>
                            {auction.registrationEnd
                              ? new Date(
                                  auction.registrationEnd
                                ).toLocaleString()
                              : null}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        height={"20%"}
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          width={"150px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Bắt đầu:
                        </Typography>

                        {auction.status === 2 ||
                        auction.status === 4 ||
                        auction.status === 7 ? (
                          <TextField
                            sx={{
                              maxWidth: "200px",
                            }}
                            id='startDate'
                            type='datetime-local'
                            name='startedAt'
                            // defaultValue={auction.startedAt}
                            defaultValue={auction.startedAt || new Date()}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <Typography variant={"h5"}>
                            {auction.startedAt
                              ? new Date(auction.startedAt).toLocaleString()
                              : null}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        height={"20%"}
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          width={"150px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Kết thúc:
                        </Typography>
                        {auction.status === 2 ||
                        auction.status === 4 ||
                        auction.status === 7 ? (
                          <TextField
                            sx={{
                              maxWidth: "200px",
                            }}
                            id='endDate'
                            type='datetime-local'
                            name='endedAt'
                            // defaultValue={auction.endedAt}
                            defaultValue={auction.endedAt || new Date()}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <Typography variant={"h5"}>
                            {auction.endedAt
                              ? new Date(auction.endedAt).toLocaleString()
                              : null}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Price */}
                  {auction.status == 6 ? (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}>
                      <Typography variant={"h5"} fontWeight={"bold"}>
                        Người chiến thắng:
                      </Typography>
                      <Typography variant={"h5"}>
                        {auction.winner.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      maxHeight={"auto"}
                      display={"flex"}
                      justifyContent={"space-between"}
                      gap={"20px"}
                      flexDirection={"column"}>
                      {auction.status != 4 && auction.status != 2 ? (
                        <Box
                          height={"auto"}
                          display={"flex"}
                          justifyContent={"space-between"}>
                          <Typography fontWeight={"bold"} variant={"h5"}>
                            Giá cao nhất:
                          </Typography>
                          <Typography variant={"h5"}>
                            {formatPrice(auction.currentPrice)}
                          </Typography>
                        </Box>
                      ) : (
                        <Box></Box>
                      )}
                      <Box
                        height={"auto"}
                        display={"flex"}
                        justifyContent={"space-between"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Giá khởi điểm:
                        </Typography>
                        <Typography variant={"h5"}>
                          {formatPrice(auction.startingPrice)}
                        </Typography>
                      </Box>
                      <Box
                        height={"auto"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Bước giá:
                        </Typography>
                        {auction.status === 4 ||
                        auction.status == 2 ||
                        auction.status === 7 ? (
                          <Box
                            display={"flex"}
                            justifyContent={"flex-end"}
                            alignItems={"center"}
                            gap={"5px"}>
                            <TextField
                              type='decimal'
                              name='step'
                              defaultValue={auction.step}
                              sx={{ textAlign: "right" }}
                              onChange={handleInputChange}
                            />
                            <span>đ</span>
                          </Box>
                        ) : (
                          <Typography variant={"h5"}>
                            {formatPrice(auction.step)}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        height={"auto"}
                        display={"flex"}
                        gap={"10px"}
                        alignItems={"center"}
                        justifyContent={"space-between"}>
                        <Box display={"flex"} justifyContent={"flex-start"}>
                          <Typography variant={"h5"} fontWeight={"bold"}>
                            Chi tiết đấu giá:
                          </Typography>
                        </Box>

                        <Box display={"flex"} justifyContent={"flex-end"}>
                          <Button
                            variant={"outlined"}
                            color={"primary"}
                            onClick={() => {
                              setIsOpenViewBidders(true);
                              handleFetchBidders(id);
                            }}>
                            Xem chi tiết
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Staff */}
                  <Box
                    margin={"20px 0"}
                    height={"auto"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      m={"10px 0"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Nhân viên:
                      </Typography>
                      <Typography variant={"h5"}>
                        {auction.staffName}
                      </Typography>
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Người bán:
                      </Typography>
                      <Typography variant={"h5"}>
                        {auction.seller.name}
                      </Typography>
                    </Box>
                  </Box>
                  {auction.status === 2 ||
                  auction.status === 4 ||
                  auction.status === 7 ? (
                    <Box>
                      {localStorage.getItem("role") == 5 ? (
                        <Box
                          display={"flex"}
                          justifyContent={"flex-end"}
                          alignItems={"center"}
                          gap={"20px"}
                          m={"10px 0"}>
                          <Box width={"50%"}>
                            <Typography
                              variant={"h6"}
                              color={colors.redAccent[400]}>
                              {errorMsg}
                            </Typography>
                          </Box>
                          <Button
                            sx={{ width: "100px", height: "50px", p: "5px" }}
                            variant='contained'
                            color='success'
                            onClick={() =>
                              handleAuctionApproval(auction.id, formData)
                            }>
                            Lưu
                          </Button>
                        </Box>
                      ) : null}
                    </Box>
                  ) : (
                    <Box></Box>
                  )}
                </Box>
                {/* Right */}
                <Box
                  // maxHeight={"80vh"}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"flex-start"}
                  width={"50%"}
                  boxShadow={2}
                  p={"20px"}
                  sx={{
                    backgroundColor: "white",
                  }}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mb={"20px"}
                    width={"100%"}
                    height={"50%"}
                    sx={{
                      overflow: "hidden",
                      borderRadius: "10px",
                      objectFit: "contain",
                    }}>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "block",
                      }}
                      src={auction.imageUrls}
                    />
                  </Box>
                  <Box m={"10px 0"} textAlign={"right"}>
                    <Typography fontWeight={"bold"} variant={"h5"}>
                      Tên sản phẩm
                    </Typography>
                    <Typography variant={"h4"}>
                      {auction.product.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Box
                      m={"10px 0"}
                      display={"flex"}
                      justifyContent={"flex-end"}>
                      <Button
                        variant='outlined'
                        onClick={() => handleViewProduct(auction.product.id)}>
                        Xem chi tiết
                      </Button>
                    </Box>
                    {auction.status === 4 && (
                      <Box
                        m={"10px 0"}
                        display={"flex"}
                        justifyContent={"flex-end"}>
                        <Button
                          sx={{ width: "100px", height: "50px", p: "5px" }}
                          variant={"outlined"}
                          color={"primary"}
                          onClick={() => {
                            openRegistrationList();
                          }}>
                          Xem danh sách đăng ký
                        </Button>
                      </Box>
                    )}

                    {auction.status === 5 && (
                      <Box
                        m={"10px 0"}
                        display={"flex"}
                        justifyContent={"flex-end"}>
                        <Button
                          variant='contained'
                          onClick={() => handleNavigateToLive(auction.id)}>
                          Tới phiên đấu giá
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* View regis list */}
            <RegistrationList
              isOpenRegisList={isOpenRegisList}
              setIsOpenRegisList={setIsOpenRegisList}
              regisList={regisList}
            />

            {/* View bidders */}
            <Dialog
              fullWidth
              sx={{
                maxHeight: "70vh",
                margin: "50px 0",
              }}
              open={isOpenViewBidders}
              onClose={() => setIsOpenViewBidders(false)}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'>
              <DialogTitle>
                Số người tham gia: {auction.numberOfBidders} <br /> Số lượt bid:{" "}
                {auction.numberOfBids}
              </DialogTitle>
              <DialogContent>
                {bidders.map((bidder, index) => (
                  <Box
                    key={bidder.bidAmount || bidder.bidderName}
                    m='10px 0'
                    style={{
                      backgroundColor:
                        index === 0
                          ? "yellow"
                          : bidder.status === 1
                          ? "transparent"
                          : "#e7e9eb", // Highlight the first bidder
                      padding: "10px",
                      color: bidder.bidder.status === 1 ? "black" : "gray",
                    }}>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h5'>{bidder.bidder.name}</Typography>
                      <Typography variant='h5'>
                        {formatPrice(bidder.bidder.bidAmount) || ""}
                      </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h5'>
                        {new Date(bidder.bidder.bidDate).toLocaleString()}
                      </Typography>
                      <Typography variant='h5'>
                        {bidder.bidder.status === 1 ? "Hợp lệ" : "Đã rút"}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </DialogContent>
            </Dialog>

            {/* View Product Details */}
            <ProductDetailModal
              isLoadingProductDetails={isLoadingProductDetails}
              isOpenProductDetail={isOpenProductDetail}
              productDetails={productDetails}
              auction={auction}
              setIsOpenProductDetail={setIsOpenProductDetail}
            />
          </>
        )}
      </Container>
    );
  } else {
    return (
      <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
        <Helmet>
          <title>Chi tiết đấu giá</title>
        </Helmet>
        {auction && (
          <>
            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              gap={"20px"}
              flex={"1"}
              alignItems={"center"}
              mb={"30px"}></Box>
            <Box display={"flex"} justifyContent={"center"}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={"20px"}
                width={"80%"}>
                {isStaffChooserOpen && (
                  <StaffChooser
                    isOpenChooser={isStaffChooserOpen}
                    setIsOpenChooser={setIsStaffChooserOpen}
                  />
                )}

                {/* Left */}
                <Box
                  // maxHeight={"80vh"}
                  width={"70%"}
                  boxShadow={2}
                  p={"20px"}
                  sx={{
                    backgroundColor: "white",
                  }}>
                  {/* Details */}
                  <Header title={`${auction.title}`} />

                  <Box width={"90%"}>
                    <Box
                      display={"flex"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      gap={"20px"}
                      padding={"10px"}
                      m={"30px 0"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Trạng thái:
                      </Typography>
                      <Chip
                        sx={{ textTransform: "uppercase", fontSize: "1rem" }}
                        label={
                          auction.status === 1
                            ? "Chưa có nhân viên"
                            : auction.status === 0
                            ? "Đang chờ duyệt"
                            : auction.status === 2
                            ? "Cập nhật thông tin"
                            : auction.status === 3
                            ? "Bị từ chối"
                            : auction.status === 4
                            ? "Mở đăng ký"
                            : auction.status === 5
                            ? "Đang diễn ra"
                            : auction.status === 6
                            ? "Đã kết thúc"
                            : auction.status === 7
                            ? "Không thành công"
                            : "Đang cập nhật"
                        }
                        color={
                          auction.status === 1
                            ? "info"
                            : auction.status === 0
                            ? "warning"
                            : auction.status === 2
                            ? "warning"
                            : auction.status === 3
                            ? "error"
                            : auction.status === 4
                            ? "info"
                            : auction.status === 5
                            ? "success"
                            : auction.status === 6
                            ? "error"
                            : auction.status === 7
                            ? "secondary"
                            : "warning"
                        }
                      />
                    </Box>
                    {/* Time */}
                    {auction.status != 0 && (
                      <Box
                        height={"40%"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-between"}>
                        <Box
                          alignItems={"center"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
                          <Typography
                            width={"150px"}
                            fontWeight={"bold"}
                            variant={"h5"}>
                            Mở đăng kí:
                          </Typography>

                          {auction.status === 2 || auction.status === 4 ? (
                            <TextField
                              sx={{
                                maxWidth: "200px",
                              }}
                              id='startDate'
                              type='datetime-local'
                              name='registrationStart'
                              // defaultValue={auction.startedAt}
                              defaultValue={
                                auction.registrationStart || new Date()
                              }
                              onChange={handleInputChange}
                            />
                          ) : (
                            <Typography variant={"h5"}>
                              {auction.registrationStart
                                ? new Date(
                                    auction.registrationStart
                                  ).toLocaleString()
                                : null}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          alignItems={"center"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
                          <Typography
                            width={"150px"}
                            fontWeight={"bold"}
                            variant={"h5"}>
                            Đóng đăng kí:
                          </Typography>

                          {auction.status === 2 || auction.status === 4 ? (
                            <TextField
                              sx={{
                                maxWidth: "200px",
                              }}
                              id='startDate'
                              type='datetime-local'
                              name='registrationEnd'
                              // defaultValue={auction.startedAt}
                              defaultValue={
                                auction.registrationEnd || new Date()
                              }
                              onChange={handleInputChange}
                            />
                          ) : (
                            <Typography variant={"h5"}>
                              {auction.registrationEnd
                                ? new Date(
                                    auction.registrationEnd
                                  ).toLocaleString()
                                : null}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
                          <Typography
                            width={"150px"}
                            fontWeight={"bold"}
                            variant={"h5"}>
                            Bắt đầu:
                          </Typography>
                          <Typography variant={"h5"}>
                            {auction.startedAt
                              ? new Date(auction.startedAt).toLocaleString()
                              : null}
                          </Typography>
                        </Box>
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
                          <Typography
                            width={"150px"}
                            fontWeight={"bold"}
                            variant={"h5"}>
                            Kết thúc:
                          </Typography>
                          <Typography variant={"h5"}>
                            {auction.endedAt
                              ? new Date(auction.endedAt).toLocaleString()
                              : null}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Price */}
                    {auction.status == 6 ? (
                      <Box
                        margin={"20px 0"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Typography variant={"h5"} fontWeight={"bold"}>
                          Người chiến thắng:
                        </Typography>
                        <Typography variant={"h5"}>
                          {auction.winner.name}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        maxHeight={"auto"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        gap={"20px"}
                        flexDirection={"column"}>
                        {auction.status != 4 && auction.status != 2 ? (
                          <Box
                            height={"auto"}
                            display={"flex"}
                            justifyContent={"space-between"}>
                            <Typography fontWeight={"bold"} variant={"h5"}>
                              Giá cao nhất:
                            </Typography>
                            <Typography variant={"h5"}>
                              {formatPrice(auction.currentPrice)}
                            </Typography>
                          </Box>
                        ) : (
                          <Box></Box>
                        )}
                        <Box
                          height={"auto"}
                          display={"flex"}
                          justifyContent={"space-between"}>
                          <Typography fontWeight={"bold"} variant={"h5"}>
                            Giá khởi điểm:
                          </Typography>
                          <Typography variant={"h5"}>
                            {formatPrice(auction.startingPrice)}
                          </Typography>
                        </Box>
                        <Box
                          height={"auto"}
                          display={"flex"}
                          justifyContent={"space-between"}>
                          <Typography fontWeight={"bold"} variant={"h5"}>
                            Bước giá:
                          </Typography>
                          <Typography variant={"h5"}>
                            {formatPrice(auction.step)}
                          </Typography>
                        </Box>
                        <Box
                          height={"auto"}
                          display={"flex"}
                          gap={"10px"}
                          alignItems={"center"}
                          justifyContent={"space-between"}>
                          <Box display={"flex"} justifyContent={"flex-start"}>
                            <Typography variant={"h5"} fontWeight={"bold"}>
                              Chi tiết đấu giá:
                            </Typography>
                          </Box>

                          <Box display={"flex"} justifyContent={"flex-end"}>
                            <Button
                              variant={"outlined"}
                              color={"primary"}
                              onClick={() => {
                                setIsOpenViewBidders(true);
                                handleFetchBidders(id);
                              }}>
                              Xem chi tiết
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Staff */}
                    <Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Nhân viên:
                        </Typography>
                        <Typography variant={"h5"}>
                          {auction.staffName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      marginBottom={"20px"}>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Người bán:
                      </Typography>
                      <Typography variant={"h5"}>
                        {auction.seller.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {/* Right */}
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"flex-start"}
                  width={"50%"}
                  boxShadow={2}
                  p={"20px"}
                  sx={{
                    backgroundColor: "white",
                  }}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mb={"20px"}
                    width={"100%"}
                    height={"50%"}
                    sx={{
                      overflow: "hidden",
                      borderRadius: "10px",
                      objectFit: "contain",
                    }}>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "block",
                      }}
                      src={auction.imageUrls}
                    />
                  </Box>
                  <Box m={"10px 0"} textAlign={"right"}>
                    <Typography fontWeight={"bold"} variant={"h5"}>
                      Tên sản phẩm
                    </Typography>
                    <Typography variant={"h4"}>
                      {auction.product.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Box
                      m={"10px 0"}
                      display={"flex"}
                      justifyContent={"flex-end"}>
                      <Button
                        variant='outlined'
                        onClick={() => handleViewProduct(auction.product.id)}>
                        Xem chi tiết
                      </Button>
                    </Box>
                    {auction.status === 4 && (
                      <Box
                        m={"10px 0"}
                        display={"flex"}
                        justifyContent={"flex-end"}>
                        <Button
                          variant={"outlined"}
                          color={"primary"}
                          onClick={() => setIsOpenRegisList(true)}>
                          Xem danh sách đăng ký
                        </Button>
                      </Box>
                    )}
                    {auction.status === 5 && (
                      <Box
                        m={"10px 0"}
                        display={"flex"}
                        justifyContent={"flex-end"}>
                        <Button
                          variant='contained'
                          onClick={() => handleNavigateToLive(auction.id)}>
                          Tới phiên đấu giá
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* view regis list */}
            <RegistrationList
              isOpenRegisList={isOpenRegisList}
              setIsOpenRegisList={setIsOpenRegisList}
              regisList={regisList}
            />

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
                Số người tham gia: {auction.numberOfBidders} <br /> Số lượt bid:{" "}
                {auction.numberOfBids}
              </DialogTitle>
              <DialogContent>
                {bidders.map((bidder, index) => (
                  <Box
                    key={bidder.bidAmount || bidder.bidderName}
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
                        {formatPrice(bidder.bidAmount) || ""}
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

            {/* View Product Details */}
            <ProductDetailModal
              isLoadingProductDetails={isLoadingProductDetails}
              isOpenProductDetail={isOpenProductDetail}
              productDetails={productDetails}
              auction={auction}
              setIsOpenProductDetail={setIsOpenProductDetail}
            />
          </>
        )}
      </Container>
    );
  }
};

export default AuctionDetail;
