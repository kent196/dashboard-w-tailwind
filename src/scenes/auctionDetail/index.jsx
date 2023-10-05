// AuctionDetail.js
import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { mockDataAuctions } from "../../data/mockData";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StaffChooser from "../../components/StaffChooser";

const AuctionDetail = () => {
  const [isStaffChooserOpen, setIsStaffChooserOpen] = useState(false);
  const navigate = useNavigate();
  // Access the 'id' from the URL parameter
  const { id } = useParams();
  const auction = mockDataAuctions.find(
    (auctionData) => auctionData.id === parseInt(id)
  );
  const handleBack = () => {
    navigate(`/auctions`);
  };
  if (!auction) {
    return <div>Auction not found</div>; // Handle the case where the user is not found
  }

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box>
        {isStaffChooserOpen && (
          <StaffChooser
            isOpenChooser={isStaffChooserOpen}
            setIsOpenChooser={setIsStaffChooserOpen}
          />
        )}
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          gap={"20px"}
          flex={"1"}
          alignItems={"center"}>
          <Box>
            <IconButton onClick={handleBack}>
              <ArrowBack />
            </IconButton>
          </Box>
          <Header title={`Auction Detail: ${auction.auctionName}`} />
        </Box>
        <Box ml={"60px"}>
          <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
            <Typography variant='h4'>ID: {id}</Typography>
            <Typography variant='h4'>
              Staff Name: {auction.staffName}
            </Typography>
            <Typography variant='h4'>
              Status: {auction.staffName.length > 0 ? "On going" : "Pending"}
            </Typography>
            {auction.staffName.length === 0 && (
              <Button
                sx={{ width: "200px", height: "50px" }}
                variant='contained'
                color='primary'
                onClick={() => setIsStaffChooserOpen(!isStaffChooserOpen)}>
                Assign a staff
              </Button>
            )}
            {/* Other details based on the 'id' */}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AuctionDetail;
