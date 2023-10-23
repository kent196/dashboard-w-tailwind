import { AlarmOn } from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { token } from "../../theme";

const CountdownTimer = ({ targetTime }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [timeRemaining, setTimeRemaining] = useState(
    // targetTime - new Date().getTime()
    null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const remainingTime = targetTime - currentTime;

      if (remainingTime <= 0) {
        clearInterval(interval);
        // You can perform some action when the countdown reaches 0, e.g., display a message or trigger an event.
      } else {
        setTimeRemaining(remainingTime);
      }
    }, 1000); // Update the countdown every 1000ms (1 second).

    // Cleanup the interval when the component unmounts.
    return () => clearInterval(interval);
  }, [targetTime]);

  const formatTime = (timeInMilliseconds) => {
    if (timeInMilliseconds === null) {
      return (
        <Box
          margin={"10px 0"}
          width={"100%"}
          height={"50px"}
          sx={{
            backgroundColor: `${colors.blueAccent[800]} !important`,
          }}
          p={"5px"}
          borderRadius={"5px"}
          display={"flex"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          gap={"5px"}>
          <AlarmOn />
          <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
            00d
          </Box>
          <Box
            style={{ width: "0.1em", textAlign: "center" }}
            fontSize={"22px"}>
            :
          </Box>
          <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
            00h
          </Box>
          <Box
            style={{ width: "0.1em", textAlign: "center" }}
            fontSize={"22px"}>
            :
          </Box>
          <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
            00m
          </Box>
          <Box
            style={{ width: "0.1em", textAlign: "center" }}
            fontSize={"22px"}>
            :
          </Box>
          <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
            00s
          </Box>
        </Box>
      );
    }
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
    const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));

    return (
      <Box
        margin={"10px 0"}
        width={"100%"}
        height={"50px"}
        sx={{
          backgroundColor: `${colors.blueAccent[800]} !important`,
        }}
        p={"5px"}
        borderRadius={"5px"}
        display={"flex"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        gap={"5px"}>
        <AlarmOn />
        <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
          {days}d
        </Box>
        <Box style={{ width: "0.1em", textAlign: "center" }} fontSize={"22px"}>
          :
        </Box>
        <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
          {hours}h
        </Box>
        <Box style={{ width: "0.1em", textAlign: "center" }} fontSize={"22px"}>
          :
        </Box>
        <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
          {minutes}m
        </Box>
        <Box style={{ width: "0.1em", textAlign: "center" }} fontSize={"22px"}>
          :
        </Box>
        <Box style={{ width: "2em", textAlign: "center" }} fontSize={"22px"}>
          {seconds}s
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <div>{formatTime(timeRemaining)}</div>
    </div>
  );
};

export default CountdownTimer;
