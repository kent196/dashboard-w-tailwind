import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDimensions, formatWeight } from "../../libs/formaters";

const ProductDetailModal = ({
  isOpenProductDetail,
  setIsOpenProductDetail,
  productDetails,
  auction,
  isLoadingProductDetails,
}) => {
  function formatPrice(price) {
    // Kiểm tra xem price có tồn tại và không phải là undefined
    if (price !== undefined) {
      // Convert price to VND format with commas for thousands
      return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    } else {
      // Trả về một giá trị mặc định hoặc thông báo lỗi tùy ý
      return "Price not available";
    }
  }

  return (
    <Dialog
      fullWidth={true}
      open={isOpenProductDetail}
      onClose={() => setIsOpenProductDetail(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title' variant='h4'>
        Chi tiết sản phẩm số {productDetails.id}
      </DialogTitle>
      <DialogContent>
        {/* Conditionally render product details or skeleton loader */}
        {isLoadingProductDetails ? (
          <Skeleton
            variant='rectangular'
            width='100%'
            height={400} // Adjust the height according to your needs
          />
        ) : (
          <Box display={"flex"} gap={"20px"} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"flex-start"} gap={"20px"}>
              <Box>
                <img
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                  }}
                  src={productDetails.imageUrls}
                />
              </Box>
              <Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Tên sản phẩm:
                  </Typography>
                  <Typography variant='h5'>{productDetails.name}</Typography>
                </Box>

                <Box>
                  {productDetails.type === 2 ? (
                    <>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Giá khởi điểm:
                      </Typography>
                      <Typography variant={"h5"}>
                        {formatPrice(productDetails.price)}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={"bold"} variant={"h5"}>
                        Giá bán:
                      </Typography>
                      <Typography variant={"h5"}>
                        {formatPrice(productDetails.price)}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} gap={"20px"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                gap={"10px"}
                flex={1}>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Phân loại
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.categoryName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Nguyên liệu
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.materialName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Tên người bán
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.seller?.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Kích thước
                  </Typography>

                  <Typography variant='h5'>
                    {formatDimensions(productDetails.dimension)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Khối lượng
                  </Typography>

                  <Typography variant='h5'>
                    {formatWeight(productDetails.weight)}
                  </Typography>
                </Box>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                gap={"10px"}
                flex={1}>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Nguồn gốc
                  </Typography>

                  <Typography variant='h5'>{productDetails.origin}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Quy cách
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.packageMethod}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Đóng gói
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.packageContent}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Điều kiện sản phẩm
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.condition === 0
                      ? "Mới"
                      : productDetails.condition === 1
                      ? "Gần như mới"
                      : productDetails.condition === 2
                      ? "Tốt"
                      : productDetails.condition === 2
                      ? "Khá ổn"
                      : "Cũ"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Loại hàng
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.type === 1
                      ? "Bán"
                      : productDetails.type === 2
                      ? "Đấu giá"
                      : undefined}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography variant='h5' fontWeight={"bold"}>
                Chi tiết sản phẩm
              </Typography>

              <Typography variant='h5'>{productDetails.description}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setIsOpenProductDetail(false)}
          color='primary'
          variant='outlined'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailModal;
