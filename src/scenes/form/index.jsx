// Libraries import
import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };
  const handleFormSubmit = (values) => {
    console.log(values);
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
                type='text'
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
            </Box>
            <Box display={"flex"} justifyContent={"end"}>
              <Button
                variant='contained'
                color='success'
                type='submit'
                onClick={handleSubmit}
                sx={{
                  marginTop: "20px",
                }}>
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
