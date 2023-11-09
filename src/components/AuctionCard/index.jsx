import { Box, Button, Chip, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { token } from "../../theme";
import { useTheme } from "@mui/material";
import { formatPrice } from "../../libs/formaters";

const AuctionCard = ({ image, title, startingPrice, status, id }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const navigation = useNavigate();
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        bgcolor: "#F7EFE5",
        boxShadow: 2,
        padding: "10px 30px",
        margin: "10px 20px",
        borderRadius: "10px",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#fff7ec",
        },
      }}>
      {/* auction info */}
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
        <Box width={"50px"} height={"50px"}>
          <img
            style={{ borderRadius: "10px" }}
            width={"100%"}
            height={"100%"}
            src={image}
            alt=''
          />
        </Box>
        <Box
          marginLeft={"20px"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-evenly"}>
          <Typography variant='h5' fontWeight={"bold"}>
            {title}
          </Typography>
          <Typography variant='h6'>{formatPrice(startingPrice)}</Typography>
        </Box>
      </Box>
      {/* nav button */}
      {id && (
        <Box>
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigation(`/auction/${id}`)}>
            Xem chi tiết
          </Button>
        </Box>
      )}
      <Chip
        sx={{
          textTransform: "uppercase",
          width: "200px",
          fontSize: "0.8rem",
        }}
        label={
          status === 1
            ? "Chưa có nhân viên"
            : status === 0
            ? "Đang chờ duyệt"
            : status === 2
            ? "Cập nhật thông tin"
            : status === 3
            ? "Bị từ chối"
            : status === 4
            ? "Mở đăng ký"
            : status === 5
            ? "Đang diễn ra"
            : status === 6
            ? "Đã kết thúc"
            : status === 7
            ? "Không thành công"
            : "Đang cập nhật"
        }
        color={
          status === 1
            ? "info"
            : status === 0
            ? "warning"
            : status === 2
            ? "warning"
            : status === 3
            ? "error"
            : status === 4
            ? "info"
            : status === 5
            ? "success"
            : status === 6
            ? "error"
            : status === 7
            ? "secondary"
            : "warning"
        }
      />
    </Box>
  );
};

export default AuctionCard;
