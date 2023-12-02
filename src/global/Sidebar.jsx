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
  VpnKey,
  HowToRegOutlined,
  LockOutlined,
  WalletOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { token } from "../theme";
import { SignalRContext } from "../context/SignalRContext";
import logo from "../assets/user_logo.jpg";
import { fetchUserData } from "../libs/accountServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Item = ({ icon, title, to, selected, setSelected, onClick }) => {
  const typographyStyle = {
    onclick: "handleLogout()",
    whiteSpace: "nowrap", // Prevent text from wrapping to the next line
    overflow: "hidden", // Hide any overflowing content
    textOverflow: "ellipsis", // Display an ellipsis (...) if text overflows
    width: "100%", // Set the width of the container to ensure text overflows
    transition: "transform 0.5s", // Add a smooth transition effect
  };

  const hoverStyle = {
    transform: "translateX(-100%)", // Move text off-screen to the left on hover
  };
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  // Signal R context
  const signalRContext = useContext(SignalRContext);
  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.clear();
    toast.info("Đăng xuất thành công", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // Perform any additional logout actions here
    if (signalRContext?.connection) {
      signalRContext.connection
        .stop()
        .then(() => {
          console.log("stop connection");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.gray[100] }}
      onClick={() => {
        setSelected(title);
        if (to === "/login") {
          handleLogout(); // Call handleLogout when "Đăng xuất" is clicked
        }
      }}
      icon={icon}>
      <Typography
        style={{ ...typographyStyle, ...(isHovered ? hoverStyle : {}) }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        variant='h5'>
        {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ userRole, currentLocation }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [collapsed, setCollapsed] = React.useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState({}); // State to store user data

  useEffect(() => {
    console.log(currentLocation);
    fetchUserData()
      .then((res) => {
        console.log(res);
        if (!res) {
          return console.log("No user data");
        }
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [collapsed]);

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
    if (user.role === 3) {
      return (
        <Box>
          <Tooltip title='Bảng điều khiển' placement='right'>
            <Box>
              <Item
                title={"Bảng điều khiển"}
                to={"/dashboard"}
                icon={<HomeOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                variant='h4'
                fontWeight={"bold"}
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Quản lí
              </Typography>
            )}
          </Box>
          <Tooltip title='Người dùng' placement='right'>
            <Box>
              <Item
                title={"Người dùng"}
                to={"/team"}
                icon={<PeopleOutline />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>

          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                variant='h4'
                fontWeight={"bold"}
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Thao tác
              </Typography>
            )}
          </Box>
          <Item
            title={"Tạo tài khoản"}
            to={"/form"}
            icon={<ListOutlined />}
            selected={selected}
            setSelected={setSelected}
          />

          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                variant='h4'
                fontWeight={"bold"}
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Tài khoản
              </Typography>
            )}
          </Box>
          <Tooltip title='Tài khoản của tôi' placement='right'>
            <Box>
              <Item
                title={"Tài khoản của tôi"}
                to={"/profile"} //Update later when API is updated
                icon={<Person2Outlined />}
                selected={selected}
                setSelected={setSelected}></Item>
            </Box>
          </Tooltip>
          <Tooltip title='Đổi mật khẩu' placement='right'>
            <Box>
              <Item
                title={"Đổi mật khẩu"}
                to={"/user/changePassword"} //Update later when API is updated
                icon={<LockOutlined />}
                selected={selected}
                setSelected={setSelected}></Item>
            </Box>
          </Tooltip>
          <Tooltip title='Đăng xuất' placement='right'>
            <Box>
              <Item
                title={"Đăng xuất"}
                to={"/login"}
                icon={<ExitToAppOutlined />}
                selected={selected}
                setSelected={setSelected}
                onClick></Item>
            </Box>
          </Tooltip>
        </Box>
      );
    } else if (user.role === 4) {
      return (
        <Box>
          <Tooltip title='Bảng điều khiển' placement='right'>
            <Box>
              <Item
                title={"Bảng điều khiển"}
                to={"/dashboard"}
                icon={<HomeOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                fontWeight={"bold"}
                variant='h4'
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Quản lí
              </Typography>
            )}
          </Box>
          <Tooltip title='Người dùng' placement='right'>
            <Box>
              <Item
                title={"Người dùng"}
                to={"/team"}
                icon={<PeopleOutline />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>

          <Tooltip title='Đấu giá' placement='right'>
            <Box>
              <Item
                title={"Đấu giá"}
                to={"/auctions/manager"}
                icon={<ListOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Tooltip title='Sản phẩm' placement='right'>
            <Box>
              <Item
                title={"Sản phẩm"}
                to={"/products"}
                icon={<StoreOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Tooltip title='Nạp rút' placement='right'>
            <Box>
              <Item
                title={"Nạp rút"}
                to={"/withdrawal"}
                icon={<WalletOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                variant='h4'
                fontWeight={"bold"}
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Tài khoản
              </Typography>
            )}
          </Box>
          <Tooltip title='Tài khoản của tôi' placement='right'>
            <Box>
              <Item
                title={"Tài khoản của tôi"}
                to={"/profile"} //Update later when API is updated
                icon={<Person2Outlined />}
                selected={selected}
                setSelected={setSelected}></Item>
            </Box>
          </Tooltip>
          <Tooltip title='Đổi mật khẩu' placement='right'>
            <Box>
              <Item
                title={"Đổi mật khẩu"}
                to={"/user/changePassword"} //Update later when API is updated
                icon={<LockOutlined />}
                selected={selected}
                setSelected={setSelected}></Item>
            </Box>
          </Tooltip>
          <Tooltip title='Đăng xuất' placement='right'>
            <Box>
              <Item
                title={"Đăng xuất"}
                to={"/login"}
                icon={<ExitToAppOutlined />}
                selected={selected}
                setSelected={setSelected}
                onClick></Item>
            </Box>
          </Tooltip>
        </Box>
      );
    } else if (user.role === 5) {
      return (
        <Box>
          <Tooltip title='Bảng điều khiển' placement='right'>
            <Box>
              <Item
                title={"Bảng điều khiển"}
                to={"/dashboard"}
                icon={<HomeOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>

          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                variant='h4'
                fontWeight={"bold"}
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Quản lí
              </Typography>
            )}
          </Box>
          <Tooltip title='Người dùng' placement='right'>
            <Box>
              <Item
                title={"Người dùng"}
                to={"/team"}
                icon={<PeopleOutline />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>

          <Tooltip title='Đấu giá' placement='right'>
            <Box>
              <Item
                title={"Đấu giá"}
                to={"/auctions"}
                icon={<ListOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Tooltip title='Sản phẩm' placement='right'>
            <Box>
              <Item
                title={"Sản phẩm"}
                to={"/products"}
                icon={<StoreOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Tooltip title='Đơn hàng' placement='right'>
            <Box>
              <Item
                title={"Đơn hàng"}
                to={"/orders"}
                icon={<Checklist />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>

          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                fontWeight={"bold"}
                variant='h4'
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Yêu cầu
              </Typography>
            )}
          </Box>

          <Tooltip title='Người bán' placement='right'>
            <Box>
              <Item
                title={"Người bán"}
                to={"/sellerRequest"}
                icon={<HowToRegOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Tooltip>
          <Box>
            {collapsed ? (
              // Dashline
              <Box display={"flex"} justifyContent={"center"}>
                <Box
                  sx={{
                    width: "60%",
                    height: "1px",
                    backgroundColor: "black",
                    margin: "20px 0",
                  }}></Box>
              </Box>
            ) : (
              <Typography
                fontWeight={"bold"}
                variant='h4'
                color={colors.gray[300]}
                sx={{
                  margin: "5px 0px 10px 15px",
                }}>
                Tài khoản
              </Typography>
            )}
          </Box>

          <Tooltip title='Tài khoản của tôi' placement='right'>
            <Box>
              <Item
                title={"Tài khoản của tôi"}
                to={"/profile"} //Update later when API is updated
                icon={<Person2Outlined />}
                selected={selected}
                setSelected={setSelected}></Item>
            </Box>
          </Tooltip>
          <Tooltip title='Đổi mật khẩu' placement='right'>
            <Box>
              <Item
                title={"Đổi mật khẩu"}
                to={"/user/changePassword"} //Update later when API is updated
                icon={<LockOutlined />}
                selected={selected}
                setSelected={setSelected}></Item>
            </Box>
          </Tooltip>

          <Tooltip title='Đăng xuất' placement='right'>
            <Box>
              <Item
                title={"Đăng xuất"}
                to={"/login"}
                icon={<ExitToAppOutlined />}
                selected={selected}
                setSelected={setSelected}
                onClick></Item>
            </Box>
          </Tooltip>
        </Box>
      );
    }
  };

  return (
    <Box
      height={"auto"}
      borderRight={`1px solid ${colors.gray[900]}`}
      display={"flex"}
      flexDirection={"column"}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[900]} !important`,
        },
        backgroundColor: "#f0f2f5",
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          backgroundColor: "#868dfb !important",
          color: "#fff !important",
        },
        "& .pro-menu-item.active": {
          backgroundColor: "#6870fa !important",
          color: "#fff !important",
        },
      }}>
      {/* Head */}
      <ProSidebar
        collapsed={collapsed}
        style={{
          flex: "1",
        }}>
        <Menu iconShape='square'>
          <MenuItem
            style={{ color: colors.primary[100] }}
            icon={collapsed ? <MenuOutlined /> : undefined}
            onClick={() => setCollapsed(!collapsed)}>
            {!collapsed && (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Typography
                  color={colors.primary[100]}
                  variant='h6'
                  sx={{
                    textTransform: "uppercase",
                  }}>
                  {user.role === 3
                    ? "Quản trị viên"
                    : user.role === 4
                    ? "Quản lí"
                    : user.role === 5
                    ? "Nhân viên"
                    : ""}
                </Typography>
                <IconButton color={colors.primary[100]}>
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
                  src={user.profilePicture || logo}
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
                  {user.name}
                </Typography>
                <Typography variant='subtitle2' color='primary'>
                  {user.role === 3
                    ? "Quản trị viên"
                    : user.role === 4
                    ? "Quản lí"
                    : user.role === 5
                    ? "Nhân viên"
                    : ""}
                </Typography>
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
