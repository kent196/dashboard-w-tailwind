import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { fetchUserData } from "../../libs/accountServices";
import { useState } from "react";
import Header from "../../components/Header";
import { formatDateTime } from "../../libs/formaters";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchUserData()
      .then((res) => {
        setCurrentUser(res.data);
        console.log(`load profile ${res.data}`);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setCurrentUser({});
    };
  }, []);
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} gap={"20px"}>
        {/* left */}
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"20px"}
          p={"20px"}
          width={"30%"}
          boxShadow={"2"}
          sx={{
            backgroundColor: "white",
          }}>
          <Box height={"200px"} display={"flex"} justifyContent={"center"}>
            <img
              style={{
                borderRadius: "50%", // Set the border radius to 50% for a circular shape
                width: "200px",
                height: "200px",
                objectFit: "cover",
              }}
              src={currentUser.profilePicture}
            />
          </Box>
          {/* info */}
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}>
            <Typography textTransform={"uppercase"} variant='h5'>
              {currentUser.name}
            </Typography>
            <Typography variant='h6'>
              {currentUser.role === 3
                ? "Quản trị viên"
                : currentUser.role === 4
                ? "Quản lí"
                : currentUser.role === 5
                ? "Nhân viên"
                : "Người dùng"}
            </Typography>
          </Box>
        </Box>
        {/* right */}
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          gap={"20px"}
          p={"20px"}
          width={"70%"}
          boxShadow={"2"}
          sx={{
            backgroundColor: "white",
          }}>
          <Header title={"Thông tin cá nhân"} />
          <Box display={"flex"} gap={"10px"} alignItems={"center"}>
            <Typography variant='h5' fontWeight={"bold"}>
              Email:
            </Typography>
            <Typography variant='h5'>{currentUser.email}</Typography>
          </Box>
          <Box display={"flex"} gap={"10px"} alignItems={"center"}>
            <Typography variant='h5' fontWeight={"bold"}>
              SDT:
            </Typography>
            <Typography variant='h5'>{currentUser.phone}</Typography>
          </Box>
          <Box display={"flex"} gap={"10px"} alignItems={"center"}>
            <Typography variant='h5' fontWeight={"bold"}>
              Ngày sinh:
            </Typography>
            <Typography variant='h5'>
              {formatDateTime(currentUser.dob)}
            </Typography>
          </Box>
          <Box display={"flex"} gap={"10px"} alignItems={"center"}>
            <Typography variant='h5' fontWeight={"bold"}>
              Giới tính:
            </Typography>
            <Typography variant='h5'>
              {currentUser.gender === 0
                ? "Nữ"
                : currentUser.gender === 1
                ? "Nam"
                : "Không muốn đề cập"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
