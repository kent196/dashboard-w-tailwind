import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../../components/Header";
import { useState } from "react";
import { updateUserPassword } from "../../libs/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [resetForm, setResetForm] = useState(false); // State variable to trigger re-render

  // Effect to reset the form when resetForm state changes
  useEffect(() => {
    if (resetForm) {
      setFormData({});
      setResetForm(false);
    }
  }, [resetForm]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdatePassword = (formData) => {
    updateUserPassword(formData)
      .then((res) => {
        toast.success("Đổi mật khẩu thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setResetForm(true); // Set the state variable to trigger re-render
        setErrorMsg(null);
      })
      .catch((err) => {
        setErrorMsg(err.response.data.message || err.response.data.Message);
      });
  };
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        gap={"20px"}>
        <Header title={"Đổi mật khẩu"} />
        <Box>
          <Typography variant='h4'>Mật khẩu cũ</Typography>
          <TextField
            type='password'
            name='oldPassword'
            variant='outlined'
            sx={{ width: "70%" }}
            value={formData.oldPassword || ""}
            onChange={handleInputChange}
          />
        </Box>
        <Box>
          <Typography variant='h4'>Mật khẩu mới</Typography>
          <TextField
            type='password'
            name='newPassword'
            variant='outlined'
            sx={{ width: "70%" }}
            value={formData.newPassword || ""}
            onChange={handleInputChange}
          />
        </Box>
        <Box>
          <Typography variant='h4'>Nhập lại mật khẩu mới</Typography>
          <TextField
            type='password'
            name='confirmPassword'
            variant='outlined'
            sx={{ width: "70%" }}
            value={formData.confirmPassword || ""}
            onChange={handleInputChange}
          />
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
          {errorMsg != "" && (
            <Typography variant='h6' color='error'>
              {errorMsg}
            </Typography>
          )}
          <Button
            sx={{ width: "20%" }}
            variant='contained'
            color='success'
            onClick={() => {
              handleUpdatePassword(formData);
            }}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePassword;
