import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../../global/Sidebar";
import Topbar from "../../global/Topbar";

const Admin = () => {
  return (
    <Box display={"flex"} position={"relative"}>
      <Sidebar user={"admin"} />
      <main>
        <Topbar />
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}>
          <h1>Admin</h1>
        </Box>
      </main>
    </Box>
  );
};

export default Admin;
