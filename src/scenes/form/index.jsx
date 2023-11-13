// Libraries import
import { Box, Button, Select, TextField, Typography } from "@mui/material";
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
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "1",
    dob: "",
    role: "4",
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleFormSubmit = (values) => {
    console.log(values);
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
          toast.error("Create account failed");
          setErrMsg(res.response.data.message || res.response.data.Message);
        } else if (res.code === 200) {
          toast.success("Create account successfully");
          setErrMsg("");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Create account failed");
      });
  };

  const phoneRegExp = /^((\+84-?)|0)?[0-9]{10}$/;

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    phone: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone is required"),
  });

  return (
    <Box m={"20px"}>
      <Helmet>
        <title>Create User</title>
      </Helmet>
      <Header title={"CREATE USER"} subTitle={"Create a new user profile"} />
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
                label='Name'
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
                label='Password'
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
                label='Phone'
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
                <Typography>Gender:</Typography>
                <Field
                  as='select'
                  name='gender'
                  label='Gender'
                  variant='filled'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.gender}
                  error={!!touched.gender && !!errors.gender}
                  helperText={touched.gender && errors.gender}
                  sx={{
                    padding: "10px",

                    gridColumn: "span 4",
                  }}>
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
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
                <Typography>Role:</Typography>
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
                  <option value={4}>Manager</option>
                  <option value={5}>Staff</option>
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
                <Typography>Date of birth:</Typography>
                <TextField
                  fullWidth
                  variant='filled'
                  type='datetime-local'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.dob}
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
              <Typography
                width={"40%"}
                color={"red"}
                variant='h6'
                textAlign={"right"}>
                {errMsg}
              </Typography>
              <Button
                variant='contained'
                color='success'
                type='submit'
                onClick={handleSubmit}>
                Create new user
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
