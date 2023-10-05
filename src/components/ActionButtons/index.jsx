import { Delete, Edit, List } from "@mui/icons-material";
import {
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { token } from "../../theme";

const ActionButtons = ({ row, rowIndex }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [deletedId, setDeletedId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const navigate = useNavigate();
  const handleViewUser = (userId) => {
    // Navigate to the user detail page with the user's ID
    navigate(`/user/${userId}`);
  };

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

  return (
    <Box>
      <IconButton
        to={`/team/user/${row.id}`}
        onClick={() => handleViewUser(row.id)} // Implement view user function
        color='primary'
        aria-label='View'
        style={{
          color: colors.gray[100],
        }}>
        <List />
      </IconButton>
      <IconButton
        style={{
          color: colors.gray[100],
        }}
        onClick={() => handleEditUser(row.id)} // Implement edit user function
        color='primary'
        aria-label='Edit'>
        <Edit />
      </IconButton>
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
        <DialogTitle id='alert-dialog-title'>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color='error'
            variant='contained'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='success'
            autoFocus
            variant='contained'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActionButtons;
