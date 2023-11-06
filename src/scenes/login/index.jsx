import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColorModeContext, useMode, token } from "../../theme";
import loginBackground from "../../assets/login_bg_1.png";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "../../api/publicAxios"; // Import Axios
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignalRContext } from "../../context/SignalRContext";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
const Login = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [error, setError] = useState(null); // Initialize error state
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false); // State variable to trigger re-render

  // Effect to reset the form when resetForm state changes
  useEffect(() => {
    if (resetForm) {
      console.log("reset form");
      setFormData({});
      setResetForm(false);
    }
  }, [resetForm]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Signal R context
  const signalRContext = useContext(SignalRContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Build signal r connection
  const buildConnection = () => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_BASE_URL}/auctionHub`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: async () => {
          return localStorage.getItem("accessToken");
        },
      })
      .withAutomaticReconnect()
      .build();
    signalRContext?.setConnection(connection);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log("Sending login request...");

      const response = await axios.post("/staff/login", formData);

      console.log("Response received:", response.data);

      setFormData({}); // Clear the form
      if (response.status === 200) {
        toast.success("Đăng nhập thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log(localStorage.accessToken);
        console.log(localStorage.refreshToken);
        buildConnection();
        setFormData({});
        setError(null);
        navigate("/dashboard"); // Navigate to the auctions page
      } else if (response.status === 401) {
        console.log(response.data.message);
        setError(response.data.message);
        // Handle the login failure
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(error.response.data.message);
      // Handle the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}>
      <Box width={"30%"}></Box>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div
        style={{
          position: "fixed", // Set position to fixed
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}>
        <img
          src={loginBackground}
          alt='Background'
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: "30",
          }}
        />
      </div>
      <Box width={"70%"} display={"flex"} justifyContent={"center"}>
        <Box
          sx={{
            backgroundColor: colors.gray[900],
            width: "50%",
            height: "auto",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin: "0 20px",
            padding: "20px",
            zIndex: "50",
          }}>
          <Header title={" Quản trị hệ thống PAH"} />

          <Typography variant='h5' fontWeight={"bold"}>
            Tên đăng nhập
          </Typography>

          <TextField
            // color={colors.gray[900]}
            id='outlined-basic'
            variant='outlined'
            sx={{ width: "70%" }}
            name='email'
            value={formData.email || ""}
            onChange={handleInputChange}
          />
          <Typography variant='h5' fontWeight={"bold"}>
            Mật khẩu
          </Typography>

          <TextField
            id='outlined-basic'
            variant='outlined'
            sx={{ width: "70%" }}
            type='password'
            name='password'
            value={formData.password || ""}
            onChange={handleInputChange}
          />
          {error != "" && ( // Display the error message only if there's an error
            <Typography variant='body2' color='error'>
              {error}
            </Typography>
          )}
          <Button
            disabled={
              formData.email === "" || formData.password === "" || loading
            }
            type='submit'
            variant='contained'
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              width: "150px",
              height: "50px",
              mt: "20px",
              backgroundColor: colors.primary[500],
              "&:hover": {
                backgroundColor: colors.primary[600],
              },
            }}
            onClick={handleLogin}>
            {loading ? "Đang đăng nhập" : "Đăng nhập"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
