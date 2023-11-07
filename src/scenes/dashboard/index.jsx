import React, { useState } from "react";
import { Helmet } from "react-helmet";
import BarChart from "../../components/BarChart";
import { Box, Grid, List, Typography } from "@mui/material";
import { fetchUserData } from "../../libs/accountServices";
import { useEffect } from "react";
import logo from "../../assets/landing_page_bg.jpg";
import cart from "../../assets/cart.png";
import Statbox from "../../components/Statbox";
import {
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

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const [auctionsCount, setAuctionsCount] = useState(0); // State to store auction details
  const [customerCount, setCustomerCount] = useState(0); // State to store auction details
  const [auctions, setAuctions] = useState([]); // State to store auction details
  const [products, setProducts] = useState({}); // State to store auction details
  const [orders, setOrders] = useState({}); // State to store auction details

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
            </Box>
          </Grid>
        </Grid>
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
