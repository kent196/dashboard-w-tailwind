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
  fetchAuctions,
  fetchStaffAuctions,
  fetchStaffEndedAuctions,
} from "../../libs/auctionService";
import { fetchProducts } from "../../libs/productServices";
import { fetchOrders } from "../../libs/orderService";
import AuctionCard from "../../components/AuctionCard";
import { token } from "../../theme";
import { useTheme } from "@emotion/react";
import { formatPrice } from "../../libs/formaters";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const [auctionsCount, setAuctionsCount] = useState(0); // State to store auction details
  const [customerCount, setCustomerCount] = useState(0); // State to store auction details
  const [auctions, setAuctions] = useState([]); // State to store auction details
  const [auctionDetail, setAuctionDetail] = useState({}); // State to store auction details
  const [products, setProducts] = useState({}); // State to store auction details
  const [orders, setOrders] = useState({}); // State to store auction details
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(1); // Default selected filter
  const [filterValue, setFilterValue] = useState(1); // Default selected filter
  const [totalRevenue, setTotalRevenue] = useState(0);
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
        console.log(res.data);
        setOrders(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        console.log(res.data);
        setProducts(res.data.productList);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setProducts({});
    };
  }, []);

  useEffect(() => {
    if (currentUser.role === 5) {
      fetchStaffEndedAuctions(filterValue)
        .then((res) => {
          console.log(res.data);
          setAuctionsCount(res.data);
          setAuctions(res.data);
          console.log("auction list");
          console.log(auctions);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.role === 4 || currentUser.role === 3) {
      // If currentUser.role is not 5, you can handle it as needed
      fetchAllEndedAuctions(filterValue)
        .then((res) => {
          console.log(res.data);
          setAuctionsCount(res.data);
          setAuctions(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
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
      .catch((err) => {
        console.log(err);
      });

    return () => {
      setCurrentUser({});
    };
  }, []);

  useEffect(() => {
    if (currentUser.role === 5) {
      fetchCustomer()
        .then((res) => {
          console.log("Count as staff");
          console.log(res.data);
          setCustomers(res.data.customerList);
          setCustomerCount(res.data.count);
          console.log(customerCount);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.role === 4) {
      fetchAllStaffs()
        .then((res) => {
          console.log(res.data);
          setCustomers(res.data.customerList);
          setCustomerCount(res.data.count);
          console.log(customers);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.role === 3) {
      fetchUsers()
        .then((res) => {
          console.log("Count as admin");

          console.log(res.data);
          setCustomers(res.data.userList);
          setCustomerCount(res.data.count);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser.role]);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box
        height={"100vh"}
        gap={"20px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}>
        {/* Top section */}

        <Header title={"Thống kê"} margin={"0 0 0 20px"} />
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
                title={"Đấu giá"}
                subTitle={`Đang quản lí ${auctions.length} phiên`}
                icon={<ListOutlined />}
              />
            ) : (
              <Statbox
                title={"Đấu giá"}
                subTitle={`${auctions.length} phiên đấu giá`}
                icon={<ListOutlined />}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Statbox
              title={"Sản phẩm"}
              subTitle={`${products.length} sản phẩm`}
              icon={<StoreOutlined />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Statbox
              title={"Đơn hàng"}
              subTitle={`${orders.length} đơn hàng`}
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
              sx={{ height: "100%", margin: "0 0 0 20px" }}
              justifyContent={"flex-start"}
              gap={"20px"}
              flexDirection={"column"}>
              <Grid container spacing={2} height={"30%"}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Paper elevation={3} sx={{ padding: "20px" }}>
                    <Header title={"Doanh thu"} />
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        <Typography variant='h4' fontWeight={"bold"}>
                          Doanh thu theo
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
                              <MenuItem onClick={() => handleClose("1", 1)}>
                                1
                              </MenuItem>
                              <MenuItem onClick={() => handleClose("3", 3)}>
                                3
                              </MenuItem>
                              <MenuItem onClick={() => handleClose("6", 6)}>
                                6
                              </MenuItem>
                              <MenuItem onClick={() => handleClose("9", 9)}>
                                9
                              </MenuItem>
                              <MenuItem onClick={() => handleClose("12", 12)}>
                                12
                              </MenuItem>
                            </Menu>
                          </Box>
                          <Typography variant='h6'>tháng</Typography>
                        </Box>
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        <Typography variant='h4' fontWeight={"bold"}>
                          Số phiên đấu giá thành công
                        </Typography>
                        <Typography margin={"20px 0"} variant='h4'>
                          {auctions.length}
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
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={3} height={"50%"}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Paper elevation={3} sx={{ padding: "20px", height: "100%" }}>
                    <Header
                      title={"Các phiên đấu giá thành công"}
                      fontSize={"24px"}
                    />
                    <Box>
                      {auctions.map((auction) => {
                        return (
                          <>
                            <AuctionCard
                              image={auction.imageUrl}
                              title={auction.title}
                              startingPrice={auction.startingPrice}
                              status={auction.status}
                              id={auction.id}
                            />
                          </>
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
                    {auctionDetail ? (
                      <Box>update khi co api</Box>
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
