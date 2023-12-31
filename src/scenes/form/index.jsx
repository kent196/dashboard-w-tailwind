// Libraries import
import {
  Box,
  Button,
  CircularProgress,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Field, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { MenuItem } from "react-pro-sidebar";
import { createAccount } from "../../libs/accountServices";
import { toast } from "react-toastify";

const Form = () => {
  const [errMsg, setErrMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "1",
    dob: new Date(),
    role: "4",
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleFormSubmit = (values) => {
    setIsLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    createAccount(values)
      .then((res) => {
        // if (res.code === 200 || res.StatusCode === 200) {
        //   toast.success("Create account successfully");
        //   setErrMsg("");
        // } else {
        //   toast.error("Create account failed");
        //   setErrMsg(res.message);
        // }
        if (res.code === "ERR_BAD_REQUEST") {
          setIsLoading(false);
          toast.error("Tạo tài khoản không thành công");
          setErrMsg(res.response.data.message || res.response.data.Message);
        } else if (res.code === 200) {
          setIsLoading(false);
          toast.success("Tạo tài khoản thành công");
          setSuccessMsg(res.message);
          setErrMsg("");
        }
      })
      .catch((err) => {
        toast.error("Create account failed");
      });
  };

  const phoneRegExp = /^((\+84-?)|0)?[0-9]{10}$/;

  const validationSchema = yup.object().shape({
    name: yup.string().required("Tên không được để trống"),
    email: yup
      .string()
      .email("Địa chỉ email không hợp lệ")
      .required("Email không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
    phone: yup
      .string()
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
  });

  return (
    <Box m={"20px"}>
      <Helmet>
        <title>Tạo tài khoản</title>
      </Helmet>
      <Header
        title={"TẠO TÀI KHOẢN"}
        subTitle={"Tạo tài khoản cho người dùng quản trị"}
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display={"grid"}
              gap={"20px"}
              gridTemplateColumns='repeat(4,minmax(0,1fr))'
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                marginTop: "20px",
              }}>
              <TextField
                label='Tên'
                fullWidth
                variant='filled'
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name='name'
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              <TextField
                label='Email'
                fullWidth
                variant='filled'
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name='email'
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              <TextField
                label='Mật khẩu'
                fullWidth
                variant='filled'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name='password'
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              <TextField
                label='Số điện thoại'
                fullWidth
                variant='filled'
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name='phone'
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              <Box
                alignItems={"center"}
                display={"flex"}
                justifyContent={"flex-start"}
                gap={"20px"}
                sx={{
                  gridColumn: "span 4",
                }}>
                <Typography>Giới tính:</Typography>
                <Field
                  as='select'
                  name='gender'
                  label='Gender'
                  variant='filled'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={1}
                  value={values.gender}
                  error={!!touched.gender && !!errors.gender}
                  helperText={touched.gender && errors.gender}
                  sx={{
                    padding: "10px",

                    gridColumn: "span 4",
                  }}>
                  <option value={1}>Nam</option>
                  <option value={0}>Nữ</option>
                </Field>
              </Box>
              <Box
                alignItems={"center"}
                display={"flex"}
                justifyContent={"flex-start"}
                gap={"20px"}
                sx={{
                  gridColumn: "span 4",
                }}>
                <Typography>Cấp bậc:</Typography>
                <Field
                  as='select'
                  name='role'
                  label='Role'
                  variant='filled'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role}
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                  sx={{
                    padding: "10px",
                    gridColumn: "span 4",
                  }}>
                  <option value={4}>Quản lí</option>
                  <option value={5}>Nhân viên</option>
                </Field>
              </Box>
              <Box
                alignItems={"center"}
                display={"flex"}
                justifyContent={"flex-start"}
                gap={"20px"}
                sx={{
                  gridColumn: "span 4",
                }}>
                <Typography>Ngày sinh:</Typography>
                <TextField
                  fullWidth
                  variant='filled'
                  type='datetime-local'
                  // defaultValue={initialValues.dob}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  // value={
                  //   values.dob &&
                  //   new Date(values.dob).toLocaleString("vi-VN", {
                  //     timeZone: "Asia/Ho_Chi_Minh",
                  //   })
                  // }
                  value={new Date(values.dob).toISOString().slice(0, 16)}
                  name='dob'
                  error={!!touched.dob && !!errors.dob}
                  helperText={touched.dob && errors.dob}
                  sx={{
                    gridColumn: "span 4",
                  }}
                />
              </Box>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              gap={"20px"}
              alignItems={"center"}
              sx={{
                marginTop: "20px",
              }}>
              {errMsg ? (
                <Typography
                  width={"40%"}
                  color={"red"}
                  variant='h6'
                  textAlign={"right"}>
                  {errMsg}
                </Typography>
              ) : (
                <Typography
                  width={"40%"}
                  color={"green"}
                  variant='h6'
                  textAlign={"right"}>
                  {successMsg}
                </Typography>
              )}
              <Button
                startIcon={isLoading ? <CircularProgress size={15} /> : null}
                variant='contained'
                color='success'
                type='submit'
                onClick={handleSubmit}
                disabled={isLoading}>
                Tạo tài khoản
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
