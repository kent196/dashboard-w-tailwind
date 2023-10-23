// AuctionDetail.js
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SnackBar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
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

const AuctionDetail = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);

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
  const [regisList, setRegisList] = useState([]); // State to store auction details
  const [formData, setFormData] = useState({
    // startedAt: "",
    // endedAt: "",
    // registrationStart: "",
    // registrationEnd: "",
  });

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
    console.log(auctionId, formData);
    updateAuctionInfo(auctionId, formData)
      .then((res) => {
        setAuction(res.data);

        // Display a success toast
        toast.success("Cập nhật thời gian thành công", {
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
            console.log(err);
            return <Error />;
          });
        // navigate(`/auctions`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAuctionRegisters(id)
      .then((res) => {
        console.log(`List of registers: ${res.data}`);
        setRegisList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleNavigateToLive = (auctionId) => {
    navigate(`/auction/live/${auctionId}`);
  };

  const handleAuctionReject = (auctionId) => {
    auctionReject(auctionId)
      .then((res) => {
        setAuction(res.data);
        navigate(`/auctions`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewProduct = (productId) => {
    // Set isLoadingProductDetails to true when loading starts
    setIsLoadingProductDetails(true);
    // Fetch product details
    fetchProduct(productId)
      .then((res) => {
        console.log(res.data);
        setProductDetails(res.data);
        // Set isLoadingProductDetails to false when loading is complete
        setIsLoadingProductDetails(false);
      })
      .catch((err) => {
        console.log(err);
        // Set isLoadingProductDetails to false on error as well
        setIsLoadingProductDetails(false);
      });
    setIsOpenProductDetail(true);
  };

  useEffect(() => {
    fetchBidders(id)
      .then((res) => {
        console.log(res.data);
        setBidders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setBidders([]);
      console.log("unmount bidders");
    };
  }, []);

  useEffect(() => {
    fetchAuctionDetail(id)
      .then((res) => {
        console.log(`Auction details: ${res.data}`);
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

        console.log(`Form data ${formData}`);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setAuction(null);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setSelectedRegisStart(null);
      setSelectedRegisEnd(null);
      console.log("unmount auction details");
    };
  }, []);

  if (!auction) {
    return <Error />; // Handle the case where the user is not found
  }

  if (
    auction.status === 1 ||
    auction.status === 2 ||
    auction.status === 3 ||
    auction.status === 4
  ) {
    return (
      <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
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
                    <Box>
                      <Box
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
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
                            {new Date(
                              auction.registrationStart
                            ).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
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
                            defaultValue={auction.registrationEnd || new Date()}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <Typography variant={"h5"}>
                            {new Date(auction.registrationEnd).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Bắt đầu:
                        </Typography>

                        {auction.status === 2 || auction.status === 4 ? (
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
                            {new Date(auction.startedAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Kết thúc:
                        </Typography>
                        {auction.status === 2 || auction.status === 4 ? (
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
                            {new Date(auction.endedAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>

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
                      {auction.status != 4 && auction.status != 2 ? (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          m={"10px 0"}>
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
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Giá khởi điểm:
                        </Typography>
                        <Typography variant={"h5"}>
                          {formatPrice(auction.startingPrice)}
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
                          {formatPrice(auction.step)}
                        </Typography>
                      </Box>
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
                              {auction.numberOfBidders}
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
                              {auction.numberOfBids}
                            </Typography>
                          </Box>
                          <Box
                            m={"10px 0"}
                            display={"flex"}
                            justifyContent={"flex-end"}>
                            <Button
                              variant={"outlined"}
                              color={"primary"}
                              onClick={() => setIsOpenViewBidders(true)}>
                              Xem chi tiết
                            </Button>
                          </Box>
                        </Box>
                      </Box>
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
                        <Typography variant={"h5"}>
                          {auction.staffName}
                        </Typography>
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
                        {formatPrice(auction.seller.name)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "black",
                        margin: "20px 0",
                      }}></Box>
                    {auction.status === 2 || auction.status === 4 ? (
                      <Box
                        display={"flex"}
                        justifyContent={"flex-end"}
                        gap={"20px"}
                        m={"10px 0"}>
                        <Button
                          sx={{ width: "100px" }}
                          variant='contained'
                          color='success'
                          onClick={() =>
                            handleAuctionApproval(auction.id, formData)
                          }>
                          Lưu
                        </Button>
                      </Box>
                    ) : (
                      <Box></Box>
                    )}
                  </Box>
                </Box>
                {/* Right */}
                <Box
                  width={"50%"}
                  boxShadow={2}
                  p={"20px"}
                  sx={{
                    backgroundColor: "white",
                  }}>
                  <Box mb={"20px"}>
                    <img
                      style={{
                        width: "100%",
                        height: "500px",
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
                      color: bidder.status === 1 ? "black" : "gray",
                    }}>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h5'>{bidder.bidderName}</Typography>
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
  } else {
    return (
      <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
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
                    <Box>
                      <Box
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
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
                            {new Date(
                              auction.registrationStart
                            ).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
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
                            defaultValue={auction.registrationEnd || new Date()}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <Typography variant={"h5"}>
                            {new Date(auction.registrationEnd).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Bắt đầu:
                        </Typography>
                        <Typography variant={"h5"}>
                          {new Date(auction.startedAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography
                          maxWidth={"100px"}
                          fontWeight={"bold"}
                          variant={"h5"}>
                          Kết thúc:
                        </Typography>
                        <Typography variant={"h5"}>
                          {new Date(auction.endedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
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
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Giá cao nhất:
                        </Typography>
                        <Typography variant={"h5"}>
                          {formatPrice(auction.currentPrice)}
                        </Typography>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0"}>
                        <Typography fontWeight={"bold"} variant={"h5"}>
                          Giá khởi điểm:
                        </Typography>
                        <Typography variant={"h5"}>
                          {formatPrice(auction.startingPrice)}
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
                          {formatPrice(auction.step)}
                        </Typography>
                      </Box>
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
                              {auction.numberOfBidders}
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
                              {auction.numberOfBids}
                            </Typography>
                          </Box>
                          <Box
                            m={"10px 0"}
                            display={"flex"}
                            justifyContent={"flex-end"}>
                            <Button
                              variant={"outlined"}
                              color={"primary"}
                              onClick={() => setIsOpenViewBidders(true)}>
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
                        </Box>
                      </Box>
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
                        <Typography variant={"h5"}>
                          {formatPrice(auction.staffName)}
                        </Typography>
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
                        {formatPrice(auction.seller.name)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {/* Right */}
                <Box
                  width={"50%"}
                  boxShadow={2}
                  p={"20px"}
                  sx={{
                    backgroundColor: "white",
                  }}>
                  <Box display={"flex"} justifyContent={"flex-end"} mb={"20px"}>
                    <img
                      style={{
                        width: "350px",
                        height: "500px",
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
                      color: bidder.status === 1 ? "black" : "gray",
                    }}>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h5'>{bidder.bidderName}</Typography>
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
