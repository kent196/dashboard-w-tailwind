import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { fetchUserData } from "../../libs/accountServices";
import { useState } from "react";
import Header from "../../components/Header";
import { formatDateTime } from "../../libs/formaters";
import { Field } from "formik";
import { CameraAltOutlined } from "@mui/icons-material";
import { storage } from "../../firebase/firebase";
import Error from "../../global/Error";
import { updateProfile as update } from "../../libs/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({}); // State to store auction details
  const [isEditing, setIsEditing] = useState(false); // State to store auction details
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: 0,
    dob: new Date(),
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageAsUrl, setImageAsUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // State to store error msg

  const handleImageAsFile = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files[0]);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageAsUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleUpload() {
    const filename =
      new Date().getTime() +
      "_" +
      file.name.substring(file.name.lastIndexOf("/"));

    const path = `/profilePicture/${filename}`;
    const ref = storage.ref(path);
    await ref.put(file);
    const url = await ref.getDownloadURL();
    setImageAsUrl(url);
    setFile(null);
    return url;
  }

  async function updateProfile() {
    setLoading(true);
    let imageUrl = currentUser.profilePicture;
    if (file != null) {
      imageUrl = await handleUpload();
    }

    // Xu ly gui formdata{...formData, profilePicture: imageUrl}
    const newFormdata = {
      ...formData,
      profilePicture: imageUrl,
    };

    update(newFormdata)
      .then((res) => {
        toast.success("Cập nhật thông tin thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsEditing(false);
      })
      .catch((err) => {
        setErrorMsg(err.response.data.message);
      });

    setLoading(false);
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchUserData()
      .then((res) => {
        setCurrentUser(res.data);
        setFormData({
          name: currentUser.name,
          phone: currentUser.phone,
          gender: currentUser.gender,
          dob: currentUser.dob,
        });
      })
      .catch((err) => {});
  }, [isEditing]);
  if (localStorage.getItem("accessToken") === null) {
    return <Error />;
  }
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Thông tin cá nhân</title>
      </Helmet>
      <Box display={"flex"} justifyContent={"space-between"} gap={"20px"}>
        {/* left */}
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"20px"}
          p={"20px"}
          width={"30%"}
          boxShadow={"2"}
          sx={{
            backgroundColor: "white",
          }}>
          {isEditing ? (
            <>
              <Box height={"200px"} display={"flex"} justifyContent={"center"}>
                <img
                  style={{
                    borderRadius: "50%", // Set the border radius to 50% for a circular shape
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  // preview picture after choose
                  src={imageAsUrl}
                />
              </Box>
              <IconButton
                disabled={loading}
                component='label'
                htmlFor='profilePicture'>
                <TextField
                  sx={{
                    display: "none",
                  }}
                  type='file'
                  id='profilePicture'
                  name='profilePicture'
                  onChange={handleImageAsFile}
                />
                <CameraAltOutlined />
              </IconButton>
            </>
          ) : (
            <Box height={"200px"} display={"flex"} justifyContent={"center"}>
              <img
                style={{
                  borderRadius: "50%", // Set the border radius to 50% for a circular shape
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
                // preview picture after upload

                src={currentUser.profilePicture}
              />
            </Box>
          )}
          {/* info */}
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}>
            <Typography textTransform={"uppercase"} variant='h5'>
              {currentUser.name}
            </Typography>
            <Typography variant='h6'>
              {currentUser.role === 3
                ? "Quản trị viên"
                : currentUser.role === 4
                ? "Quản lí"
                : currentUser.role === 5
                ? "Nhân viên"
                : "Người dùng"}
            </Typography>
          </Box>
        </Box>
        {/* right */}
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          gap={"20px"}
          p={"20px"}
          width={"70%"}
          boxShadow={"2"}
          sx={{
            backgroundColor: "white",
          }}>
          <Header
            title={`${isEditing ? "Cập nhật thông tin" : "Thông tin cá nhân"}`}
          />
          {isEditing ? (
            <>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Tên:
                </Typography>
                <TextField
                  sx={{
                    width: "50%",
                    bgcolor: `${loading ? "#f5f5f5" : "white"}`,
                    interactive: `${loading ? "false" : "true"}`,
                  }}
                  id='name'
                  type='name'
                  name='name'
                  defaultValue={currentUser.name}
                  onChange={handleInputChange}
                />
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  SDT:
                </Typography>
                <TextField
                  sx={{
                    width: "50%",
                    bgcolor: `${loading ? "#f5f5f5" : "white"}`,
                    interactive: `${loading ? "false" : "true"}`,
                  }}
                  id='phone'
                  type='number'
                  name='phone'
                  defaultValue={currentUser.phone}
                  onChange={handleInputChange}
                />
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Ngày sinh:
                </Typography>
                <TextField
                  sx={{
                    width: "50%",
                    bgcolor: `${loading ? "#f5f5f5" : "white"}`,
                    interactive: `${loading ? "false" : "true"}`,
                  }}
                  id='dob'
                  type='datetime-local'
                  name='dob'
                  defaultValue={currentUser.dob || new Date()}
                  onChange={handleInputChange}
                />
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Giới tính:
                </Typography>
                <select
                  style={{
                    bgcolor: `${loading ? "#f5f5f5" : "white"}`,
                    interactive: `${loading ? "false" : "true"}`,
                    width: "50%",
                    border: "1px solid #000",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  value={formData.gender}
                  id='gender'
                  name='gender'
                  onChange={handleInputChange}>
                  <option value={1}>Nam</option>
                  <option value={0}>Nữ</option>
                </select>
              </Box>
            </>
          ) : (
            <>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Email:
                </Typography>
                <Typography variant='h5'>{currentUser.email}</Typography>
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  SDT:
                </Typography>
                <Typography variant='h5'>{currentUser.phone}</Typography>
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Ngày sinh:
                </Typography>
                <Typography variant='h5'>
                  {formatDateTime(currentUser.dob)}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Giới tính:
                </Typography>
                <Typography variant='h5'>
                  {currentUser.gender === 0
                    ? "Nữ"
                    : currentUser.gender === 1
                    ? "Nam"
                    : "Không muốn đề cập"}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <Typography variant='h5' fontWeight={"bold"}>
                  Mật khẩu:
                </Typography>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => navigate("/user/changePassword")}>
                  Thay đổi
                </Button>
              </Box>
            </>
          )}

          <Box display={"flex"} justifyContent={"flex-end"} width={"100%"}>
            {isEditing ? (
              <>
                <Typography marginRight={"10px"} variant='h6' color={"red"}>
                  {errorMsg}
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={"10px"}>
                  <Button
                    sx={{ display: `${loading ? "none" : "block"}` }}
                    variant='contained'
                    color='error'
                    onClick={() => {
                      setIsEditing(false);
                    }}>
                    Hủy
                  </Button>
                  <Button
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                    variant='contained'
                    color='success'
                    onClick={() => {
                      updateProfile(formData);
                    }}>
                    {loading ? "Đang cập nhật" : "Lưu"}
                  </Button>
                </Box>
              </>
            ) : (
              <Box>
                <Button
                  variant='contained'
                  color='warning'
                  onClick={() => {
                    setImageAsUrl(currentUser.profilePicture);
                    setIsEditing(true);
                  }}>
                  Cập nhật
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
