import React, { useState } from "react";
import { Helmet } from "react-helmet";
import BarChart from "../../components/BarChart";
import {
  Box,
  Button,
  Grid,
  List,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { fetchUserData } from "../../libs/accountServices";
import { useEffect } from "react";
import logo from "../../assets/landing_page_bg.jpg";
import cart from "../../assets/cart.png";
import Statbox from "../../components/Statbox";
import {
  CalendarMonthOutlined,
  Checklist,
  ListOutlined,
  Person2Outlined,
  StoreOutlined,
} from "@mui/icons-material";
import {
  fetchAllStaffs,
  fetchCustomer,
  fetchUsers,
} from "../../libs/userService";
import Header from "../../components/Header";
import {
  fetchAllEndedAuctions,
  fetchAuctionDetail,
  fetchAuctions,
  fetchStaffAuctions,
  fetchStaffEndedAuctions,
} from "../../libs/auctionService";
import { fetchProducts } from "../../libs/productServices";
import { fetchFrequentUsers, fetchOrders } from "../../libs/orderService";
import AuctionCard from "../../components/AuctionCard";
import { token } from "../../theme";
import { useTheme } from "@emotion/react";
import { formatPrice } from "../../libs/formaters";
import Error from "../../global/Error";
import UserCard from "../../components/UserCard";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const [auctionsCount, setAuctionsCount] = useState(0); // State to store auction details
  const [customerCount, setCustomerCount] = useState(0); // State to store auction details
  const [auctions, setAuctions] = useState([]); // State to store auction details
  const [auctionDetail, setAuctionDetail] = useState(null); // State to store auction details
  const [products, setProducts] = useState({}); // State to store auction details
  const [orders, setOrders] = useState({}); // State to store auction details
  const [anchorEl, setAnchorEl] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0); // State to store auction details
  const [productsCount, setProductsCount] = useState(0); // State to store auction details
  const [selectedFilter, setSelectedFilter] = useState(2023); // Default selected filter
  const [filterValue, setFilterValue] = useState(2023); // Default selected filter
  const endedFilterValue = 12;
  const [totalAuctions, setTotalAuctions] = useState(0); // Default selected filter
  const [totalRevenue, setTotalRevenue] = useState(0);
  const frequentUsersPageSize = 5;
  const [frequentUsers, setFrequentUsers] = useState([]);
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const finalPrice = 1000000;

  const [currentPrice, setCurrentPrice] = useState(1);

  useEffect(() => {
    const animationDuration = 1000; // Duration in milliseconds (adjust as needed)
    const framesPerSecond = 60;
    const totalFrames = (animationDuration / 1000) * framesPerSecond;
    const incrementValue = finalPrice / totalFrames;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const newPrice = Math.min(finalPrice, frame * incrementValue);
      setCurrentPrice(newPrice);

      if (frame === totalFrames) {
        clearInterval(interval);
      }
    }, 1000 / framesPerSecond);

    // Cleanup the interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [finalPrice]);

  useEffect(() => {
    if (currentUser.role === 3 || currentUser.role === 4) {
      fetchAuctions()
        .then((res) => {
          setTotalAuctions(res.data.count);
        })
        .catch((err) => {});
    } else if (currentUser.role === 5) {
      fetchStaffAuctions()
        .then((res) => {
          setTotalAuctions(res.data.count);
        })
        .catch((err) => {});
    }
  }, [currentUser.role]);
  useEffect(() => {
    fetchFrequentUsers(frequentUsersPageSize)
      .then((res) => {
        console.log(res.data);
        setFrequentUsers(res.data);
      })
      .catch((err) => {});
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (filter, value) => {
    setAnchorEl(null);
    if (filter) {
      setSelectedFilter(filter);
      setFilterValue(value);
      // You can perform some filtering action here based on the selected filter.
      // For demonstration purposes, we're just updating the state.
    }
  };

  const handleViewAuctionDetail = (id) => {
    fetchAuctionDetail(id)
      .then((res) => {
        setAuctionDetail(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        return <Error />;
      });
  };

  const handleCalculateTotalRevenue = () => {
    let total = 0;
    let formatTotal = 0;
    auctions.map((auction) => {
      total += auction.numberOfBidders * auction.entryFee;
      formatTotal = formatPrice(total);
    });
    return formatTotal;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchOrders()
      .then((res) => {
        // setOrders(res.data.list);
        setOrdersCount(res.data.count);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        // setProducts(res.data.productList);
        setProductsCount(res.data.count);
      })
      .catch((err) => {});
    return () => {
      setProducts({});
    };
  }, []);

  useEffect(() => {
    if (currentUser.role === 5) {
      fetchStaffEndedAuctions(endedFilterValue)
        .then((res) => {
          setAuctionsCount(res.data.count);
          setAuctions(res.data);
        })
        .catch((err) => {});
    } else if (currentUser.role === 4 || currentUser.role === 3) {
      // If currentUser.role is not 5, you can handle it as needed
      fetchAllEndedAuctions(endedFilterValue)
        .then((res) => {
          console.log(res);
          setAuctionsCount(res.data.count);
          setAuctions(res.data);
        })
        .catch((err) => {});
    }

    return () => {
      setAuctions([]);
    };
    // No need for a cleanup function in this case
  }, [currentUser.role, filterValue]);

  useEffect(() => {
    fetchUserData()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {});

    return () => {
      setCurrentUser({});
    };
  }, []);

  useEffect(() => {
    if (currentUser.role === 5) {
      fetchCustomer()
        .then((res) => {
          setCustomers(res.data.customerList);
          setCustomerCount(res.data.count);
        })
        .catch((err) => {});
    } else if (currentUser.role === 4) {
      fetchAllStaffs()
        .then((res) => {
          setCustomers(res.data.customerList);
          setCustomerCount(res.data.count);
        })
        .catch((err) => {});
    } else if (currentUser.role === 3) {
      fetchUsers()
        .then((res) => {
          setCustomers(res.data.userList);
          setCustomerCount(res.data.count);
        })
        .catch((err) => {});
    }
  }, [currentUser.role]);

  return (
    <div>
      <Helmet>
        <title>Bảng điều khiển</title>
      </Helmet>
      <Box
        height={"100vh"}
        gap={"20px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}>
        {/* Top section */}

        <Header title={"Bảng điều khiển"} margin={"0 0 0 20px"} />
        <Grid
          container
          // spacing={2}
          justifyContent={"space-between"}
          sx={{
            width: "100%",
            margin: "0 0 0 20px",
          }}>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Statbox
              to={"/team"}
              title={`${
                currentUser.role === 5
                  ? "Khách hàng"
                  : currentUser.role === 4
                  ? "Nhân viên"
                  : "Người dùng"
              }`}
              subTitle={`${customerCount} đang hoạt động`}
              icon={<Person2Outlined />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            {currentUser.role === 5 ? (
              <Statbox
                to={"/auctions"}
                title={"Đấu giá"}
                subTitle={`Đã được giao ${totalAuctions || 0} phiên`}
                icon={<ListOutlined />}
              />
            ) : (
              <Statbox
                to={"/auctions/manager"}
                title={"Đấu giá"}
                subTitle={`${totalAuctions || 0} phiên đấu giá`}
                icon={<ListOutlined />}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Statbox
              to={"/products"}
              title={"Sản phẩm"}
              subTitle={`${productsCount} sản phẩm`}
              icon={<StoreOutlined />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Statbox
              to={"/orders"}
              title={"Đơn hàng"}
              subTitle={`${ordersCount} đơn hàng`}
              icon={<Checklist />}
            />
          </Grid>
        </Grid>
        <Box
          width={"100%"}
          height={"80%"}
          display={"flex"}
          justifyContent={"flex-start"}>
          <Box width={"95%"} height={"100%"}>
            <Grid
              container
              sx={{ height: "auto", margin: "0 0 0 20px" }}
              justifyContent={"flex-start"}
              gap={"20px"}
              flexDirection={"column"}>
              <Grid container spacing={2} height={"50%"}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} height={"100%"}>
                  <Paper elevation={3} sx={{ padding: "20px", height: "100%" }}>
                    <Header title={"Khách hàng thân thiết"} />
                    <Box
                      sx={{
                        height: "80%",
                        overflowY: "scroll",
                      }}>
                      {frequentUsers.map((user) => (
                        <UserCard
                          isDashboard={true}
                          bidderName={user.name}
                          avatar={user.profilePicture}
                          numberOfDoneOrders={user.numberOfDoneOrders}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} height={"auto"}>
                  <Paper elevation={3} sx={{ padding: "20px", height: "100%" }}>
                    <Header title={"Doanh thu"} />

                    <Box
                      display={"flex"}
                      // justifyContent={"space-between"}
                      alignItems={"center"}>
                      <Box display={"flex"} alignItems={"center"} gap={"20px"}>
                        <Typography variant='h4' fontWeight={"bold"}>
                          Năm
                        </Typography>
                        {/* filter box */}
                        <Box
                          display={"flex"}
                          justifyContent={"flex-start"}
                          gap={"10px"}
                          alignItems={"center"}
                          margin={"20px 0"}>
                          <Box
                            sx={
                              {
                                // display: "flex",
                                // justifyContent: "flex-end",
                                // alignItems: "center",
                                // gap: "20px",
                                // marginBottom: "20px",
                              }
                            }>
                            <Button
                              variant='contained'
                              startIcon={<CalendarMonthOutlined />}
                              onClick={handleClick}>
                              {selectedFilter}
                            </Button>
                            <Menu
                              sx={{
                                padding: "10px",
                                height: "300px",
                              }}
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={() => handleClose(null)} // Close the menu when clicking outside
                            >
                              {/* <MenuItem
                                onClick={() => handleClose("2020", 2020)}>
                                2020
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleClose("2021", 2021)}>
                                2021
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleClose("2022", 2022)}>
                                2022
                              </MenuItem> */}
                              <MenuItem
                                onClick={() => handleClose("2023", 2023)}>
                                2023
                              </MenuItem>
                              {/* <MenuItem
                                onClick={() => handleClose("2024", 2024)}>
                                2024
                              </MenuItem> */}
                            </Menu>
                          </Box>
                        </Box>
                      </Box>

                      {/* <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        <Typography variant='h4' fontWeight={"bold"}>
                          Số phiên đấu giá thành công
                        </Typography>
                        <Typography margin={"20px 0"} variant='h4'>
                          {auctions.length || 0}
                        </Typography>
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        <Typography variant='h4' fontWeight={"bold"}>
                          Lợi nhuận từ đấu giá
                        </Typography>
                        <Typography variant='h4' margin={"20px 0"}>
                          {handleCalculateTotalRevenue()}
                        </Typography>
                      </Box> */}
                    </Box>
                    <Box height={"70%"} width={"100%"}>
                      <BarChart isDashboard={true} filterValue={filterValue} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                height={"50%"}
                sx={{ marginBottom: "20px" }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "20px",
                      height: "100%",
                    }}>
                    <Header
                      title={"Các phiên đấu giá thành công"}
                      fontSize={"24px"}
                    />
                    <Box
                      sx={{
                        overflowY: "scroll",
                        height: "80%",
                      }}>
                      {auctions.map((auction) => {
                        return (
                          <Box
                            onClick={() => {
                              handleViewAuctionDetail(auction.id);
                            }}>
                            <AuctionCard
                              image={auction.imageUrl}
                              title={auction.title}
                              startingPrice={auction.startingPrice}
                              status={auction.status}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "20px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    {auctionDetail != null ? (
                      <Box
                        width={"90%"}
                        height={"100%"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        gap={"20px"}>
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          width={"300px"}
                          height={"400px"}
                          sx={{
                            objectFit: "contain",
                            overflow: "hidden",
                          }}>
                          <img
                            width={"100%"}
                            height={"100%"}
                            src={auctionDetail.imageUrls}
                          />
                        </Box>
                        <Box width={"60%"}>
                          <Typography
                            margin={"20px 0"}
                            variant='h4'
                            fontWeight={"bold"}>
                            {auctionDetail.title}
                          </Typography>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}>
                            <Typography variant='h5' fontWeight={"bold"}>
                              Số người tham gia:
                            </Typography>
                            <Typography variant='h5'>
                              {auctionDetail.numberOfBidders}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}>
                            <Typography variant='h5' fontWeight={"bold"}>
                              Phí tham gia:
                            </Typography>
                            <Typography variant='h5'>
                              {formatPrice(auctionDetail.entryFee)}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}>
                            <Typography variant='h5' fontWeight={"bold"}>
                              Giá khởi điểm:
                            </Typography>
                            <Typography variant='h5'>
                              {formatPrice(auctionDetail.startingPrice)}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}>
                            <Typography variant='h5' fontWeight={"bold"}>
                              Giá bán:
                            </Typography>
                            <Typography variant='h5'>
                              {formatPrice(auctionDetail.currentPrice)}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}>
                            <Typography variant='h5' fontWeight={"bold"}>
                              Lợi nhuận:
                            </Typography>
                            <Typography variant='h5'>
                              {formatPrice(
                                auctionDetail.numberOfBidders *
                                  auctionDetail.entryFee
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box>Chọn 1 cuộc đấu giá để xem</Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Statbox
          width={"100%"}
          height={"400px"}
          children={<BarChart isDashboard={true} />}
        /> */}
      </Box>{" "}
    </div>
  );
};

export default Dashboard;
