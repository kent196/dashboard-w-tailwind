import React, { useState } from "react";
import { Helmet } from "react-helmet";
import BarChart from "../../components/BarChart";
import { Box, Grid, List } from "@mui/material";
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
import { fetchCustomer, fetchUsers } from "../../libs/userService";
import Header from "../../components/Header";
import { fetchAuctions, fetchStaffAuctions } from "../../libs/auctionService";
import { fetchProducts } from "../../libs/productServices";
import { fetchOrders } from "../../libs/orderService";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const [auctions, setAuctions] = useState({}); // State to store auction details
  const [products, setProducts] = useState({}); // State to store auction details
  const [orders, setOrders] = useState({}); // State to store auction details

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchOrders()
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
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
      fetchStaffAuctions(currentUser.id)
        .then((res) => {
          console.log(res.data);
          setAuctions(res.data.auctionList);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.role === 4) {
      // If currentUser.role is not 5, you can handle it as needed
      fetchAuctions()
        .then((res) => {
          console.log(res.data);
          setAuctions(res.data.auctionList);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      setAuctions({});
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
          console.log(res.data);
          setCustomers(res.data.customerList);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetchUsers()
        .then((res) => {
          console.log(res.data);
          setCustomers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      setCustomers([]);
    };
  }, []);

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
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"97%"}
          p={"10px 30px"}
          m={"10px 20px"}
          boxShadow={2}
          borderRadius={"10px"}
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
          {/* left */}
          <Box>
            <Header
              textTransform={"capitalize"}
              title={`Hello ${currentUser.name}!`}
              subTitle={"Welcome back to PAH"}
              fontSize={"h2.fontSize"}
            />
          </Box>
          {/* right */}
          <Box height={"230px"}>
            <img
              width={"50%"}
              height={"50%"}
              src={cart}
              style={{
                objectFit: "contain",
                overflow: "hidden",
                zIndex: "1",
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Statbox
              title={"Người dùng"}
              subTitle={`${customers.length} đang hoạt động`}
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

        <Statbox
          width={"100%"}
          height={"400px"}
          children={<BarChart isDashboard={true} />}
        />
      </Box>{" "}
    </div>
  );
};

export default Dashboard;
