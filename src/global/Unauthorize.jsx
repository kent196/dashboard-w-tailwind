import { Box, Button, Container } from "@mui/material";
import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Unauthorize = () => {
  const navigate = useNavigate();
  // Ensure that role is treated as an array

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        gap={"10px"}
        flexDirection={"column"}
        alignItems={"center"}>
        <Header
          textAlign={"center"}
          title={"Unauthorize"}
          subTitle={"You are not allow to access this page"}
        />
        <Button variant='contained' color='primary' onClick={handleBackToLogin}>
          Back to login page
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorize;
