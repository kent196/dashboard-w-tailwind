// Libraries import
import {
  Box,
  IconButton,
  useTheme,
  InputBase,
  Popper,
  MenuItem,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  Settings,
  Search,
  NotificationAddOutlined,
  Person,
  Notifications,
} from "@mui/icons-material";
import React, { useContext } from "react";

// Local  import
import { ColorModeContext, token } from "../theme";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchUserData } from "../libs/accountServices";

const Topbar = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigation = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setUserData] = React.useState({});

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  useEffect(() => {
    fetchUserData().then((res) => {
      setUserData(res.data);
    });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
      }}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      p={"5px"}>
      {/* Search */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignContent={"center"}
        ml={"10px"}
        backgroundColor={colors.primary[400]}
        borderRadius={"5px"}
        p={"5px"}>
        {/* <InputBase
          placeholder='Search...'
          sx={{
            ml: 2,
            flex: 1,
          }}
        />
        <IconButton type='button' sx={{ p: 1 }}>
          <Search />
        </IconButton> */}
      </Box>
      {/* Action icons */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignContent={"center"}>
        {/* <IconButton
          type='button'
          sx={{ p: 1 }}
          onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton> */}
        {/* <IconButton type='button' sx={{ p: 1 }}>
          <Notifications />
        </IconButton>
        <IconButton type='button' sx={{ p: 1 }}>
          <Settings />
        </IconButton> */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          margin={"10px"}>
          <Typography variant='h6'>Xin chào {userData.name}</Typography>
        </Box>
        <Box
          width={"30px"}
          height={"30px"}
          aria-describedby={id}
          type='button'
          sx={{
            // p: 1,
            margin: "10px",
            objectFit: "cover",
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={handleClick}>
          {/* <Person /> */}
          <img width={"100%"} height={"100%"} src={userData.profilePicture} />
        </Box>{" "}
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
              <MenuItem onClick={() => navigation("/profile")}>
                Tài khoản
              </MenuItem>
              <MenuItem onClick={() => navigation("/user/changePassword")}>
                Đổi mật khẩu
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.clear();
                  navigation("/login");
                }}>
                Đăng xuất
              </MenuItem>
            </Box>
          </ClickAwayListener>
        </Popper>
      </Box>
    </Box>
  );
};

export default Topbar;
