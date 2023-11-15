import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { token } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../Header";
import {
  deactivateAccount,
  fetchUserData,
  fetchUserDetails,
} from "../../libs/userService";
import Error from "../../global/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActionButtons = ({ row, handleRerender }) => {
  const theme = useTheme();
  const { id } = useParams();
  const colors = token(theme.palette.mode);
  const [deletedId, setDeletedId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [openViewUser, setOpenViewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [scroll, setScroll] = React.useState("paper");

  // State to store user details
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
    phone: "",
    access: "",
  });
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
    phone: "",
    access: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      const updatedMockDataTeam = mockDataTeam.map((userData) =>
        userData.id === editUser.id ? editUser : userData
      );
      mockDataTeam.length = 0;
      mockDataTeam.push(...updatedMockDataTeam);
      // Use navigate to navigate back to the detail page
      navigate(`/user/${id}`);
    }, 1000);
  };

  // Function to fetch user details
  const handleFetchUserDetails = (userId) => {
    try {
      fetchUserDetails(userId)
        .then((res) => {
          setUserDetails(res.data);
        })
        .catch((err) => {});

      setOpenViewUser(true); // Open the "View User" dialog
    } catch (error) {}
  };

  const handleOpenEditUser = (userId) => {
    const res = mockDataTeam.find((userData) => userData.id === userId); // Replace with your API endpoint
    setEditUser(res);
    setOpenEditUser(true);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const handleViewUser = () => {
    setOpenViewUser(true);
  };

  const handleEditUser = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    fetchUserDetails(userId)
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        return <Error />;
      });
    setDeletedId(userId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    deactivateAccount(deletedId)
      .then((res) => {
        toast.success("Xóa thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        handleRerender();
      })
      .catch((err) => {
        return <Error />;
      });
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleViewUserClose = () => {
    setOpenViewUser(false);
  };
  const handleEditUserClose = () => {
    setOpenEditUser(false);
  };

  return (
    <Box>
      <IconButton
        onClick={() => handleFetchUserDetails(row.id)}
        color='primary'
        aria-label='View'
        style={{
          color: colors.gray[100],
        }}>
        <Visibility />
      </IconButton>
      {/* <IconButton
        style={{
          color: colors.gray[100],
        }}
        onClick={() => handleOpenEditUser(row.id)}
        color='primary'
        aria-label='Edit'>
        <Edit />
      </IconButton> */}
      <IconButton
        onClick={() => handleDeleteUser(row.id)}
        color='error'
        aria-label='Delete'>
        <Delete />
      </IconButton>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <Typography variant='h5'>
            Bạn có muốn xóa {userDetails.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color='error'
            variant='contained'>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='success'
            autoFocus
            variant='contained'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* View user */}
      <Dialog
        fullWidth
        open={openViewUser}
        onClose={handleViewUserClose}
        scroll={scroll}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'>
        <DialogTitle id='scroll-dialog-title' variant='h4'>
          Thông tin của {userDetails.name}
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <Box id='scroll-dialog-description' tabIndex={-1}>
            {/* Display user details here */}
            <Typography variant='h5'>ID: {row.id}</Typography>
            <Typography variant='h5'>Tên: {userDetails.name}</Typography>
            <Typography variant='h5'>Email: {userDetails.email}</Typography>
            <Typography variant='h5'>SDT: {userDetails.phone}</Typography>
            <Typography variant='h5'>
              Cấp bậc:{" "}
              {userDetails.role === 1
                ? "Người mua"
                : userDetails.role === 2
                ? "Người bán"
                : "Người dùng"}
            </Typography>
            {/* Add more user details as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='error'
            onClick={() => handleDeleteUser(row.id)}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit user */}
      <Dialog
        fullWidth
        open={openEditUser}
        onClose={handleEditUserClose}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'>
        <DialogTitle id='scroll-dialog-title' variant='h4'>
          Cập nhật thông tin của {editUser.name}
        </DialogTitle>
        <DialogContent>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            width={"100%"}
            gap={"20px"}>
            <form onSubmit={handleSubmit}>
              <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                  <Typography variant='h4'>Tên</Typography>
                  <TextField
                    variant='outlined'
                    name='name'
                    value={editUser.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                  <Typography variant='h4'>Email</Typography>
                  <TextField
                    variant='outlined'
                    name='email'
                    value={editUser.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                  <Typography variant='h4'>SDT</Typography>
                  <TextField
                    variant='outlined'
                    name='phone'
                    value={editUser.phone}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                  <Typography variant='h4'>Tuổi</Typography>
                  <TextField
                    variant='outlined'
                    name='age'
                    value={editUser.age}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Box>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                gap={"10px"}
                mt={"10px"}>
                <Button type='submit' variant='contained' color='success'>
                  Lưu
                </Button>
                <Button
                  onClick={() => {
                    setOpenEditUser(false);
                    navigate(`/team`);
                  }} // Use navigate to go back to detail page
                  variant='contained'
                  color='error'>
                  Hủy
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ActionButtons;
