import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { token } from "../../../theme";
import { mockDataTeam } from "../../../data/mockData";
import Header from "../../../components/Header";

const Edit = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const user = mockDataTeam.find((userData) => userData.id === parseInt(id));

  const [editedUser, setEditedUser] = useState(user);
  if (!user) {
    return <div>User not found</div>;
  }
  //   setEditedUser(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      const updatedMockDataTeam = mockDataTeam.map((userData) =>
        userData.id === editedUser.id ? editedUser : userData
      );
      mockDataTeam.length = 0;
      mockDataTeam.push(...updatedMockDataTeam);
      // Use navigate to navigate back to the detail page
      navigate(`/user/${id}`);
    }, 1000);
  };

  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        m={"20px 20px"}
        width={"50%"}
        p={"20px"}
        gap={"20px"}
        sx={{
          borderRadius: "4px",
          boxShadow: colors.gray[500] + " 0px 0px 10px 0px ",
        }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          width={"100%"}
          gap={"20px"}>
          <Header title={"Edit user"} />
          <form onSubmit={handleSubmit}>
            <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
              <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                <Typography variant='h4'>Name</Typography>
                <TextField
                  variant='outlined'
                  name='name'
                  value={editedUser.name}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                <Typography variant='h4'>Email</Typography>
                <TextField
                  variant='outlined'
                  name='email'
                  value={editedUser.email}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                <Typography variant='h4'>Phone</Typography>
                <TextField
                  variant='outlined'
                  name='phone'
                  value={editedUser.phone}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
                <Typography variant='h4'>Age</Typography>
                <TextField
                  variant='outlined'
                  name='age'
                  value={editedUser.age}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
              <Box display={"flex"} justifyContent={"flex-start"} gap={"10px"}>
                <Button type='submit' variant='contained' color='success'>
                  Save
                </Button>
                <Button
                  onClick={() => navigate(`/team`)} // Use navigate to go back to detail page
                  variant='contained'
                  color='error'>
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
        <Box height={"100%"}>{/* Display user's avatar or image here */}</Box>
      </Box>
    </Box>
  );
};

export default Edit;
