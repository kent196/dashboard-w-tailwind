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
import { fetchAuctions, fetchStaffAuctions } from "../../libs/auctionService";
import { fetchProducts } from "../../libs/productServices";
import { fetchOrders } from "../../libs/orderService";
import AuctionCard from "../../components/AuctionCard";
import { token } from "../../theme";
import { useTheme } from "@emotion/react";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const [auctionsCount, setAuctionsCount] = useState(0); // State to store auction details
  const [customerCount, setCustomerCount] = useState(0); // State to store auction details
  const [auctions, setAuctions] = useState([]); // State to store auction details
  const [products, setProducts] = useState({}); // State to store auction details
  const [orders, setOrders] = useState({}); // State to store auction details
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(1); // Default selected filter
  const [filterValue, setFilterValue] = useState(0); // Default selected filter
  const theme = useTheme();
  const colors = token(theme.palette.mode);

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
      fetchStaffAuctions(5, 0)
        .then((res) => {
          console.log(res.data);
          setAuctionsCount(res.data.count);
          setAuctions(res.data.auctionList);
          console.log(auctions);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.role === 4 || currentUser.role === 3) {
      // If currentUser.role is not 5, you can handle it as needed
      fetchAuctions(5, 0)
        .then((res) => {
          console.log(res.data);
          setAuctionsCount(res.data.count);
          setAuctions(res.data.auctionList);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      setAuctions([]);
    };
    // No need for a cleanup function in this case
  }, [currentUser.role]);

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
        height={"75vh"}
        gap={"20px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}>
        {/* Top section */}

        <Header title={"Thống kê"} fontSize={"24px"} margin={"0 0 0 20px"} />
        <Grid container spacing={2}>
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
          <Grid flex={1} item xs={12} sm={6} md={3} lg={3} xl={3}>
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
          justifyContent={"center"}>
          <Box width={"80%"} height={"100%"}>
            <Grid
              container
              spacing={2}
              sx={{ height: "100%", margin: "0 0 0 20px" }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{
                  height: "100%",
                  padding: "10px",
                  boxShadow: 2,
                  bgcolor: "white",
                }}>
                <Header title={"Các phiên đấu giá gần đây"} fontSize={"24px"} />
                <Box
                  // margin={"0 0 0 20px"}
                  sx={{
                    height: "70%",
                    overflowY: "scroll",
                  }}>
                  {auctions &&
                    auctions.map((auction) => (
                      <Box key={auction.productId}>
                        <AuctionCard
                          title={auction.title}
                          image={auction.imageUrl}
                          startingPrice={auction.startingPrice}
                          id={auction.id}
                          status={auction.status}
                        />
                      </Box>
                    ))}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{
                  height: "100%",
                  padding: "10px",
                  boxShadow: 2,
                  bgcolor: "white",
                }}>
                <Box>
                  <Header
                    title={"Doanh thu"}
                    fontSize={"24px"}
                    margin={"0 0 0 20px"}
                  />
                  <Box marginTop={"20px"}>
                    <Box
                      display={"flex"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      gap={"10px"}>
                      <Typography variant='h5' fontWeight={"bold"}>
                        Số phiên đấu giá thành công:
                      </Typography>
                      <Typography variant='h5'>5</Typography>
                    </Box>
                    {/* filter box */}
                    <Box
                      display={"flex"}
                      justifyContent={"flex-start"}
                      gap={"10px"}
                      alignItems={"center"}
                      marginTop={"20px"}>
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
                    {/* income box */}
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                      alignItems={"center"}>
                      <Typography variant='h5' fontWeight={"bold"}>
                        Tổng doanh thu
                      </Typography>
                      <Typography
                        sx={{ fontSize: "180px" }}
                        color={colors.greenAccent[500]}>
                        5
                      </Typography>
                    </Box>
                  </Box>
                </Box>
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
