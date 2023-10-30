import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  endAuction,
  fetchAuctionDetail,
  fetchBidders,
} from "../../libs/auctionService";
import { useState } from "react";
import { formatDateTime, formatPrice } from "../../libs/formaters";
import Header from "../../components/Header";
import UserCard from "../../components/UserCard";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";
import CountdownTimer from "../../components/CountdownTimer";
import {
  ArrowBack,
  EmojiEventsOutlined,
  GavelOutlined,
} from "@mui/icons-material";
import Error from "../../global/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignalRContext } from "../../context/SignalRContext";

const Live = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const { id } = useParams();
  const [auctionDetails, setAuctionDetails] = useState({}); // State to store auction details
  const [bids, setBids] = useState([]); // State to store auction details
  const [endedAt, setEndedAt] = useState(new Date()); // State to store auction details
  const [loading, setLoading] = useState(false); // State to store auction details
  const [connection, setConnection] = useState(); // State to store signal r connection
  const [winner, setWinner] = useState({
    bidder: {}
  }); // State to store signal r connection
  const [isOpenWinner, setIsOpenWinner] = useState(false); // State to store signal r connection
  const navigate = useNavigate();
  const styles = {
    gradientBox: {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", // Define the gradient colors and direction
      borderRadius: 3, // You can adjust the border radius as needed
      border: 0,
      color: "white",
      padding: "10px", // Add padding for content inside the box
    },
  };

  // Signal R context
  const signalRContext = useContext(SignalRContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchAuctionDetail(id)
      .then((res) => {
        setLoading(false);
        console.log(`Auction details: ${res.data}`);
        const date = new Date(res.data.endedAt);
        console.log(date);
        const miliseconds = date.getTime();
        console.log(miliseconds);
        setEndedAt(miliseconds);
        setAuctionDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchBidders(id)
      .then((res) => {
        setLoading(false);

        console.log(res.data);
        setBids(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // SignalR onreceive
    if (signalRContext?.connection) {
      signalRContext?.connection.on("ReceiveNewBid", (userName, auctionTitle) => {
        fetchBidders(id)
          .then((res) => {
            setBids(res.data);
          })
          .catch((err) => {
            console.log(err);
          });

        fetchAuctionDetail(id)
          .then((res) => {
            const date = new Date(res.data.endedAt);
            const miliseconds = date.getTime();
            setEndedAt(miliseconds);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      signalRContext?.connection.on("ReceiveAuctionEnd", (auctionTitle) => {
        setIsOpenWinner(true);
      });
    }

    return () => {
      setAuctionDetails({});
      setBids([]);
    };
  }, []);

  const handleEndAuction = (auctionId) => {
    endAuction(auctionId)
      .then((res) => {
        toast.success("Kết thúc phiên đấu giá", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setEndedAt(0);
        //setWinner(bids[0]);
        setIsOpenWinner(true);
      })
      .catch((err) => {
        console.log(err);
        return <Error />;
      });
  };

  const handleBack = () => {
    navigate(`/auction/${id}`);
  };

  if (loading) {
    return <Skeleton />;
  }
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px", maxHeight: "100vh" }}>
      <Box
        p={"10px"}
        borderRadius={"5px"}
        display={"flex"}
        gap={"20px"}
        justifyContent={"flex-start"}
        alignItems={"center"}>
        <Box>
          <Button
            variant='outlined'
            onClick={handleBack}
            size='large'
            startIcon={<ArrowBack />}>
            Trở lại
          </Button>
        </Box>
      </Box>
      <Box
        maxHeight={"100vh"}
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        gap={"20px"}>
        {/* Product display */}
        <Box
          width={"30%"}
          // maxHeight={"700px"}
          height={"75vh"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          boxShadow={"1"}
          p={"10px"}
          gap={"20px"}
          borderRadius={"10px"}
          sx={{
            backgroundColor: "white",
          }}>
          <Header
            margin={"10px 0"}
            title={"Bảng điều khiển"}
            fontSize={"24px"}
          />
          {/* product img */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            height={"30%"}
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
              src={auctionDetails.imageUrls}
            />
          </Box>

          {/* product info */}
          <Box
            width={"100%"}
            // height={"40%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}>
            <Box
              p={"0 10px"}
              display={"flex"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              width={"100%"}
              gap={"20px"}>
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
            <Box p={"0 10px"}>
              <Box m={"20px 0 5px 0"}>
                <Typography variant='h4' fontWeight={"bold"}>
                  {auctionDetails.title}
                </Typography>
              </Box>
              <Box m={"10px 0"}>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Giá khởi điểm:
                  </Typography>
                  <Typography variant='h5'>
                    {formatPrice(auctionDetails.startingPrice)}
                  </Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Bước giá:
                  </Typography>
                  <Typography variant='h5'>
                    {formatPrice(auctionDetails.step)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box p={"0 10px"}>
              <Typography variant='h5' fontWeight={"bold"} width={"100%"}>
                {" "}
                Thời gian còn lại:
              </Typography>
              <Typography textAlign={"right"} variant='h5'>
                <CountdownTimer targetTime={endedAt} />
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Bids */}
        <Box
          borderRadius={"10px"}
          boxShadow={"1"}
          p={"10px"}
          height={"75vh"}
          width={"40%"}
          sx={{
            backgroundColor: "white",
          }}>
          <Header
            margin={"10px 0"}
            title={"Danh sách đấu giá"}
            fontSize={"24px"}
          />
          <Box
            // maxHeight={"80%"}
            height={"80%"}
            sx={{
              overflowY: "scroll",
            }}>
            {bids.length > 0 ? (
              bids.map((bid, index) => (
                <Box
                  key={bid.id}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={"10px"}
                  sx={{
                    // padding: "10px",
                    margin: "10px",
                    backgroundColor:
                      index === 0
                        ? `${colors.blueAccent[800]} !important`
                        : bid.status === 1
                          ? "transparent"
                          : "#e7e9eb",
                    textDecoration: bid.status === 2 ? "line-through" : "",
                  }}>
                  {/* <Typography variant='h6'>{bid.bidder.name}</Typography>
                  <Typography variant='h6'>
                    {formatPrice(bid.bidAmount)}
                  </Typography> */}
                  <UserCard
                    avatar={bid.bidder.profilePicture}
                    bidderName={bid.bidder.name}
                    bidDate={formatDateTime(bid.bidDate)}
                    bidAmmount={formatPrice(bid.bidAmount)}
                    email={bid.bidder.email}
                  />
                </Box>
              ))
            ) : (
              <Box>Chưa có ai đặt giá sản phẩm này</Box>
            )}
          </Box>
        </Box>
        {/* Staff actions */}
        <Box
          borderRadius={"10px"}
          boxShadow={"1"}
          p={"10px"}
          height={"75vh"}
          width={"30%"}
          sx={{
            backgroundColor: "white",
          }}>
          <Header
            margin={"10px 0"}
            title={"Bảng điều khiển"}
            fontSize={"24px"}
          />
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"20px"}
            padding={"10px"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant='h5' fontWeight={"bold"}>
                {" "}
                Tổng số lần đặt giá:
              </Typography>
              <Typography variant='h5'> {bids.length}</Typography>
            </Box>

            <Box display={"flex"} justifyContent={"center"}>
              <Button
                startIcon={<GavelOutlined />}
                variant='contained'
                color='error'
                onClick={() => handleEndAuction(auctionDetails.id)}>
                Kết thúc phiên
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Winner */}
      <Dialog
        fullWidth
        sx={{
          maxHeight: "70vh",
          margin: "50px 0",
        }}
        open={isOpenWinner}
        onClose={() => {
          setIsOpenWinner(false);
          navigate("/auctions");
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' variant='h4'>
          Cuộc đấu giá đã kết thúc
        </DialogTitle>
        <DialogContent>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            gap={"20px"}>
            {/* <UserCard
              icon={<EmojiEventsOutlined color='warning' />}
              avatar={winner.bidder.profilePicture}
              bidderName={winner.bidder.name}
              email={winner.bidder.email}
              bidAmmount={winner.bidAmount}
            /> */}
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Button
                variant='contained'
                color='error'
                onClick={() => navigate("/auctions")}>
                Đóng
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Live;
