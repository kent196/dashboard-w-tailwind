import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const RegistrationList = ({
  isOpenRegisList,
  setIsOpenRegisList,
  regisList,
}) => {
  return (
    <Dialog
      fullWidth
      open={isOpenRegisList}
      onClose={() => setIsOpenRegisList(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle fontSize={"24px"}>
        Số người đăng kí: {regisList.length}
      </DialogTitle>
      <DialogContent>
        <Box height={"400px"}>
          {regisList.map((item) => (
            <Box m={"10px 0"} key={item.id} p={"10px"} boxShadow={2}>
              <Typography variant='h5'>
                {item.bidder.name} ({item.bidder.email})
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationList;
