import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box
        gap={"30px"}
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}>
        <Box>
          <Header textAlign={"center"} title={"Error"} />
          <Typography variant='h5' align='center'>
            Something went wrong, please try again later.
          </Typography>
        </Box>
        <Button
          sx={{
            width: "200px",
          }}
          onClick={() => handleBack()}
          variant='contained'
          color='primary'>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
