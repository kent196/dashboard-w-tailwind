import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import React, { useEffect } from "react";
import Header from "../../components/Header";
import { useState } from "react";
import { updateUserPassword } from "../../libs/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useNavigation } from "react-router-dom";

const ChangePassword = () => {
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [resetForm, setResetForm] = useState(false); // State variable to trigger re-render
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    updateUserPassword(formData)
      .then((res) => {
        setLoading(false);
        toast.success("Đổi mật khẩu thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setResetForm(true); // Set the state variable to trigger re-render
        setErrorMsg(null);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Cập nhật mật khẩu chưa thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setErrorMsg(err.response.data.message || err.response.data.Message);
      });
  };
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Cập nhật mật khẩu</title>
      </Helmet>
      <Box
        p={"10px"}
        borderRadius={"5px"}
        display={"flex"}
        gap={"20px"}
        justifyContent={"flex-start"}
        alignItems={"center"}>
        <Box>
          <Button
            variant='outlined'
            onClick={() => {
              navigation("/profile");
            }}
            size='large'
            startIcon={<ArrowBack />}>
            Thông tin cá nhân
          </Button>
        </Box>
      </Box>
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
        <Box
          sx={{
            padding: "10px",
            borderRadius: "5px",
            width: "70%",
          }}>
          <Typography variant='h5' color={"gray"}>
            Mật khẩu cần có ít nhất 8 ký tự, ít nhất 1 số, 1 chữ cái thường và 1
            chữ cái in hoa
          </Typography>
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
            startIcon={loading && <CircularProgress size={15} />}
            disabled={loading}
            onClick={() => {
              handleUpdatePassword(formData);
            }}>
            {loading ? "Đang cập nhật" : "Lưu"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePassword;
