import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColorModeContext, useMode, token } from "../../theme";
import loginBackground from "../../assets/login_bg_1.png";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";

const Login = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
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
          zIndex: "-1",
          overflow: "hidden",
        }}>
        <img
          src={loginBackground}
          alt='Background'
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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
            gap: "20px",
            margin: "0 20px",
            padding: "20px",
          }}>
          <Header title={" PAH Management Website"} />
          <TextField
            // color={colors.gray[900]}
            id='outlined-basic'
            label='Username'
            variant='outlined'
            sx={{ width: "70%" }}
          />{" "}
          <TextField
            id='outlined-basic'
            label='Password'
            variant='outlined'
            sx={{ width: "70%" }}
          />
          <Button
            variant='contained'
            sx={{
              width: "150px",
              height: "50px",
              backgroundColor: colors.primary[500],
              "&:hover": {
                backgroundColor: colors.primary[600],
              },
            }}>
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
