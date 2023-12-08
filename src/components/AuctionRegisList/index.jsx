import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import UserCard from "../UserCard";

const RegistrationList = ({
  isOpenRegisList,
  setIsOpenRegisList,
  regisList,
}) => {
  return (
    <Dialog
      fullWidth
      open={isOpenRegisList}
      onClose={() => {
        setIsOpenRegisList(false);
      }}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle fontSize={"24px"}>
        Số người đăng kí hợp lệ: {regisList.length}
      </DialogTitle>
      <DialogContent>
        <Box height={"500px"} sx={{ overflowY: "scroll" }}>
          {regisList.map((item) => (
            <Box key={item.bidder.bidAmount} pr={"30px"}>
              <UserCard
                avatar={item.bidder.profilePicture}
                bidderName={item.bidder.name}
                email={item.bidder.email}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
{
  /* <Box m={"10px 0"} key={item.id} p={"10px"} boxShadow={2}>
              <Typography variant='h5'>
                {item.bidder.name} ({item.bidder.email})
              </Typography>
            </Box> */
}
export default RegistrationList;
