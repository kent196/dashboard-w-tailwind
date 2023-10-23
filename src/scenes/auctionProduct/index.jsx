import { DeleteOutline, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { fetchAuctionProducts, fetchProduct } from "../../libs/productServices";
import { token } from "../../theme";

const AuctionProducts = () => {
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = token(theme.palette.mode);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchAuctionProducts()
      .then((res) => {
        console.log(res.data.productList);
        setProducts(res.data.productList);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setProducts([]);
    };
  }, []);

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

  const handleOpenConfirmDelete = (productId) => {
    setIsOpenConfirmDelete(true);
    fetchProduct(productId)
      .then((res) => {
        console.log(res.data);
        setProductDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewProduct = (productId) => {
    // Navigate to the user detail page with the user's ID
    fetchProduct(productId)
      .then((res) => {
        console.log(res.data);
        setProductDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsOpenProductDetail(true);
  };
  const column = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "sellerName",
      headerName: "Tên người bán",
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 1,
    },

    {
      field: "price",
      headerName: "Giá",
      flex: 1,
      // Use the valueFormatter to format the price
      valueFormatter: (params) => {
        // Format the price to VND with commas for thousands
        return params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },

    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (row) => (
        <>
          <Box>
            <IconButton onClick={() => handleViewProduct(row.id)}>
              <Visibility />
            </IconButton>
            <IconButton onClick={() => handleOpenConfirmDelete(row.id)}>
              <DeleteOutline color='error' />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];
  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <Box>
        <Box>
          <Header title={"Danh sách sản phẩm đấu giá"} />
        </Box>
        <Box
          m={"20px 0"} // Reduced top margin
          sx={{
            overflowX: "auto", // Add horizontal scroll for smaller screens
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.gray[900],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: colors.gray[900],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.gray[100]} !important `,
            },
            // Media queries for responsive column width
            "@media (max-width: 768px)": {
              "& .access-column": {
                // Adjust the width for smaller screens
                flexBasis: "20%",
              },
            },
            "@media (max-width: 480px)": {
              "& .access-column": {
                // Further adjust the width for mobile screens
                flexBasis: "15%",
              },
            },
          }}>
          <DataGrid
            style={{
              fontSize: "18px",
            }}
            rows={products}
            columns={column}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>

      {/* View product details */}
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
                    Tên sản phẩm
                  </Typography>
                  <Typography variant='h5'>{productDetails.name}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Giá
                  </Typography>

                  <Typography variant='h5'>
                    {formatPrice(productDetails.price)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
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
                    Chi tiết sản phẩm
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.description}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Kích thước
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.dimension}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Khối lượng
                  </Typography>

                  <Typography variant='h5'>{productDetails.weight}</Typography>
                </Box>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
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
                    {productDetails.condition}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Loại hàng
                  </Typography>

                  <Typography variant='h5'>
                    {productDetails.type === 0 ? "For sale" : "For auction"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='h5' fontWeight={"bold"}>
                    Đánh giá
                  </Typography>

                  <Typography variant='h5'>{productDetails.ratings}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsOpenProductDetail(false)}
            color='error'
            variant='contained'>
            Hủy
          </Button>
          <Button
            onClick={() => setIsOpenProductDetail(false)}
            color='success'
            autoFocus
            variant='contained'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detete product */}
      <Dialog
        open={isOpenConfirmDelete}
        onClose={() => setIsOpenConfirmDelete(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' variant='h4'>
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <Typography variant='h5'>
            Bạn muốn xóa {productDetails.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsOpenConfirmDelete(false)}
            color='error'
            variant='contained'>
            Hủy
          </Button>
          <Button
            onClick={() => setIsOpenConfirmDelete(false)}
            color='success'
            autoFocus
            variant='contained'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AuctionProducts;
