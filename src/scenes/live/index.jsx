import {
  Box,
  Button,
  Chip,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAuctionDetail, fetchBidders } from "../../libs/auctionService";
import { useState } from "react";
import { formatDateTime, formatPrice } from "../../libs/formaters";
import Header from "../../components/Header";
import UserCard from "../../components/UserCard";
import { formatDate } from "@fullcalendar/core";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";
import CountdownTimer from "../../components/CountdownTimer";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { ArrowBack } from "@mui/icons-material";

const Live = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const { id } = useParams();
  const [auctionDetails, setAuctionDetails] = useState({}); // State to store auction details
  const [bids, setBids] = useState([]); // State to store auction details
  const [endedAt, setEndedAt] = useState(new Date()); // State to store auction details
  const [loading, setLoading] = useState(false); // State to store auction details
  const [connection, setConnection] = useState(); // State to store signal r connection
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
    buildConnection();

    return () => {
      setAuctionDetails({});
      setBids([]);
    };
  }, []);

  const buildConnection = () => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_BASE_URL}/auctionHub`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: async () => {
          return localStorage.getItem("accessToken");
        },
      })
      .withAutomaticReconnect()
      .build();
    setConnection(connection);
  };

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connection started!");
          connection.on("ReceiveMessage", (user, message) => {
            console.log(`'${message}' - ${user}`);
          });

          connection.on("ReceiveNewBid", (userName, auctionTitle) => {
            console.log(`'${userName} just place a bid in '${auctionTitle}'`);
            fetchBidders(id)
              .then((res) => {
                setBids(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          });

          connection
            .invoke("JoinGroup", parseInt(id))
            .catch((err) => console.log(err));
        })
        .catch((error) => {
          console.log("Error while establishing connection :(");
          console.log(error);
        });
    }
  }, [connection]);

  const handleBack = () => {
    navigate(`/auction/${id}`);
  };

  if (loading) {
    return <Skeleton />;
  }
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
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
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        gap={"20px"}>
        {/* Product display */}
        <Box
          width={"30%"}
          minHeight={"500px"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
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
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Box
              width={"300px"}
              height={"300px"}
              sx={{
                overflow: "hidden",
                objectFit: "contain",
              }}>
              <img
                width={"100%"}
                height={"100%"}
                src={auctionDetails.imageUrls}
              />
            </Box>
          </Box>

          {/* product info */}
          <Box width={"100%"}>
            {/*title  */}
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              // alignItems={"center"}
              gap={"10px"}>
              <Box
                p={"0 10px"}
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"center"}
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
        </Box>
        {/* Bids */}
        <Box
          borderRadius={"10px"}
          boxShadow={"1"}
          p={"10px"}
          height={"100%"}
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
            minHeight={"500px"}
            height={"70%"}
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

          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            m={"20px 0"}
            borderRadius={"10px"}
            minHeight={"100px"}
            sx={
              {
                // backgroundColor: `${colors.blueAccent[800]} !important`,
              }
            }>
            {/* {bids.length > 0 ? (
              <Box
                width={"80%"}
                minHeight={"100px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Người thắng hiện tại:
                </Typography>
                <Typography variant='h5'>
                  {formatPrice(auctionDetails.currentPrice)}
                </Typography>
              </Box>
            ) : (
              <Box>Chưa có người thắng cuộc</Box>
            )} */}
          </Box>
        </Box>
        {/* Staff actions */}
        <Box
          borderRadius={"10px"}
          boxShadow={"1"}
          p={"10px"}
          minHeight={"500px"}
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
              <Button variant='contained' color='info'>
                Kết thúc phiên
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Live;
