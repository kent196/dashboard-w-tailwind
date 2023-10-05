import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";

// Local imports
import { token } from "../../../theme";
import { mockDataTeam } from "../../../data/mockData";
import avatar from "../../../assets/user_logo.jpg";
import Header from "../../../components/Header";
import { useState } from "react";
import { Delete } from "@mui/icons-material";

const Detail = () => {
  const [deletedId, setDeletedId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const { id } = useParams(); // Get the user ID from the route parameters

  const navigate = useNavigate();

  const handleEditUser = (userId) => {
    // Navigate to the edit user page with the user's ID
    navigate(`/edit/${userId}`);
  };
  const handleDeleteUser = (userId) => {
    setDeletedId(userId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    // Implement the actual delete action here, if needed
    // For now, let's just close the dialog
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  // Find the user with the matching ID in the mock data
  const user = mockDataTeam.find((userData) => userData.id === parseInt(id));

  if (!user) {
    return <div>User not found</div>; // Handle the case where the user is not found
  }

  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        m={"20px 20px"}
        width={"80%"}
        p={"20px"}
        gap={"20px"}
        sx={{
          // backgroundColor: colors.gray[900],
          borderRadius: "4px",
          boxShadow: colors.gray[500] + " 0px 0px 10px 0px ",
        }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={"20px"}>
          <Header title={"User Detail"} fontSize={"100px"} />
          <Box>
            <Typography variant='h4'>Name</Typography>
            <Typography variant='h5' color={colors.greenAccent[300]}>
              {user.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant='h4'>Email</Typography>
            <Typography variant='h5' color={colors.greenAccent[300]}>
              {user.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant='h4'>Phone</Typography>
            <Typography variant='h5' color={colors.greenAccent[300]}>
              {user.phone}
            </Typography>
          </Box>
          <Box>
            <Typography variant='h4'>Age</Typography>
            <Typography variant='h5' color={colors.greenAccent[300]}>
              {user.age}
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"flex-start"} gap={"10px"}>
            <Button
              variant='contained'
              color='warning'
              onClick={() => handleEditUser(id)} // Implement edit user function
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteUser(id)}
              color='error'
              variant='contained'
              aria-label='Delete'>
              Delete
            </Button>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteConfirmationOpen}
              onClose={handleCancelDelete}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'>
              <DialogTitle id='alert-dialog-title'>
                {"Confirm Delete"}
              </DialogTitle>
              <DialogContent>
                <p>Are you sure you want to delete {user.name}?</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color='primary'>
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color='primary' autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
        <Box height={"100%"}>
          <img src={avatar} />
        </Box>
      </Box>
    </Box>
  );
};

export default Detail;
