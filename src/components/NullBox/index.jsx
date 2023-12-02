import React from "react";
import Header from "../Header";
import { Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NullBox = ({ header, navTo, buttonText }) => {
  const navigate = useNavigate();
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Header title={`${header}`} />
      <Button
        variant='contained'
        color='primary'
        onClick={() => navigate(`/${navTo}`)}>
        Quay lại {buttonText}
      </Button>
    </Container>
  );
};

export default NullBox;
