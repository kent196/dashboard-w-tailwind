// Libraries import
import {
  ContactsOutlined,
  ExitToAppOutlined,
  HomeOutlined,
  ListOutlined,
  MenuOutlined,
  PeopleOutline,
  ReceiptOutlined,
  ShoppingBagOutlined,
  BarChartOutlined,
  PieChartOutlineOutlined,
  StoreOutlined,
  Checklist,
  Person2Outlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { token } from "../theme";

import logo from "../assets/user_logo.jpg";

const Item = ({ icon, title, to, selected, setSelected }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.gray[100] }}
      onClick={() => setSelected(title)}
      icon={icon}>
      <Typography variant='h6'>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ user, currentLocation }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [collapsed, setCollapsed] = React.useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // Function to handle resizing of the window
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true); // Collapse the sidebar when the screen is small
    } else {
      setCollapsed(false);
    }
  };

  // Add an event listener to handle window resize
  useEffect(() => {
    handleResize(); // Call the function once to set initial state
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize); // Remove event listener on component unmount
    };
  }, []);

  const renderMenuItem = () => {
    if (user === "admin") {
      return (
        <Box>
          <Item
            title={"Dashboard"}
            to={"/dashboard"}
            icon={<HomeOutlined />}
            selected={
              selected ||
              currentLocation === "/" ||
              currentLocation === "/dashboard"
            } // Check if the current location matches the route
            setSelected={setSelected}
          />
          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Management
          </Typography>
          <Item
            title={"Users"}
            to={"/team"}
            icon={<PeopleOutline />}
            selected={selected}
            setSelected={setSelected}
          />

          <Item
            title={"Contacts"}
            to={"/contacts"}
            icon={<ContactsOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title={"Invoices"}
            to={"/invoices"}
            icon={<ReceiptOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Pages
          </Typography>
          <Item
            title={"Create user"}
            to={"/form"}
            icon={<ListOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title={"Bar chart"}
            to={"/bar"}
            icon={<BarChartOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title={"Pie chart"}
            to={"/pie"}
            icon={<PieChartOutlineOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Account
          </Typography>

          <Item
            title={"Logout"}
            to={"/logout"}
            icon={<ExitToAppOutlined />}
            selected={selected}
            setSelected={setSelected}></Item>
        </Box>
      );
    } else if (user === "manager") {
      return (
        <Box>
          <Item
            title={"Dashboard"}
            to={"/dashboard"}
            icon={<HomeOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Management
          </Typography>
          <Item
            title={"Users"}
            to={"/team"}
            icon={<PeopleOutline />}
            selected={selected}
            setSelected={setSelected}
          />

          <Item
            title={"Auctions"}
            to={"/auctions"}
            icon={<ShoppingBagOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Account
          </Typography>

          <Item
            title={"Logout"}
            to={"/logout"}
            icon={<ExitToAppOutlined />}
            selected={selected}
            setSelected={setSelected}></Item>
        </Box>
      );
    } else {
      return (
        <Box>
          <Item
            title={"Dashboard"}
            to={"/dashboard"}
            icon={<HomeOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Management
          </Typography>
          <Item
            title={"Users"}
            to={"/team"}
            icon={<PeopleOutline />}
            selected={selected}
            setSelected={setSelected}
          />

          <Item
            title={"Auctions"}
            to={"/"}
            icon={<ListOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title={"Products"}
            to={"/products"}
            icon={<StoreOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title={"Orders"}
            to={"/orders"}
            icon={<Checklist />}
            selected={selected}
            setSelected={setSelected}
          />

          <Typography
            variant='h6'
            color={colors.gray[300]}
            sx={{
              margin: "5px 0px 10px 15px",
            }}>
            Account
          </Typography>

          <Item
            title={"Profile"}
            to={"/profile"} //Update later when API is updated
            icon={<Person2Outlined />}
            selected={selected}
            setSelected={setSelected}></Item>

          <Item
            title={"Logout"}
            to={"/logout"}
            icon={<ExitToAppOutlined />}
            selected={selected}
            setSelected={setSelected}></Item>
        </Box>
      );
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}>
      {/* Head */}
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape='square'>
          <MenuItem
            icon={collapsed ? <MenuOutlined /> : undefined}
            onClick={() => setCollapsed(!collapsed)}>
            {!collapsed && (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Typography
                  variant='h6'
                  color={colors.greenAccent[300]}
                  sx={{
                    textTransform: "uppercase",
                  }}>
                  {user}
                </Typography>
                <IconButton>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* USER */}
          {!collapsed && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              m={"5px"}>
              <Box>
                <img
                  src={logo}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    objectFit: "cover",
                    width: "100px",
                    height: "100px",
                  }}
                />
              </Box>
              <Box textAlign={"center"}>
                <Typography
                  variant='h6'
                  color={colors.greenAccent[300]}
                  sx={{
                    textTransform: "uppercase",
                  }}>
                  {user}
                </Typography>
                <Typography variant='subtitle2'>User Role</Typography>
              </Box>
            </Box>
          )}
          {/* MENU ITEMS */}
          {renderMenuItem()}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
