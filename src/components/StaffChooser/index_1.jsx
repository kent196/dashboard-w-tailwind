import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useEffect, useState } from "react";
import { mockDataTeam } from "../../data/mockData";
import { fetchStaffs } from "../../libs/userService";
import { token } from "../../theme";
import { addStaffToHost } from "../../libs/auctionService";

const StaffChooserModal = ({
  isOpenChooser,
  setIsOpenChooser,
  auctionId,
  rerender,
}) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [scroll, setScroll] = React.useState("paper");
  const [staffs, setStaffs] = useState([]); // State to store auction details
  const [staffId, setStaffId] = useState(null);

  const handleClickOpen = (scrollType) => () => {
    setIsOpenChooser(true);
    setScroll(scrollType);
  };

  useEffect(() => {
    fetchStaffs()
      .then((res) => {
        console.log(res.data);
        setStaffs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setStaffs([]);
      console.log("unmount staffs");
    };
  }, []);

  const handleClose = () => {
    setIsOpenChooser(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (isOpenChooser) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpenChooser]);
  return (
    <Box>
      <Dialog
        open={isOpenChooser}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
        fullWidth>
        <DialogTitle id='scroll-dialog-title' variant='h4'>
          Chọn nhân viên cho buổi đấu giá
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <Box
            id='scroll-dialog-description'
            ref={descriptionElementRef}
            tabIndex={-1}>
            {staffs.map((user) => (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                p={"5px"}
                onClick={() => {
                  // handleAssignStaff(auctionId, user.id);
                  rerender(auctionId, user.id);
                  handleClose();
                }}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0,0,0,0.1)",
                  },
                }}
                key={user.id}>
                <Typography variant='h5' color={colors.primary[300]}>
                  {user.name}
                </Typography>
                <Typography variant='h5' color={colors.primary[300]}>
                  {user.phone}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StaffChooserModal;
