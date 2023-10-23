import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
  Button,
  Skeleton,
} from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { token } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataProducts, mockDataTeam } from "../../data/mockData";
import { DeleteOutline, List, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGridStrategyProcessing } from "@mui/x-data-grid/hooks/core/strategyProcessing";
import axios from "../../api/publicAxios";
import { fetchProducts, fetchProduct } from "../../libs/productServices";
import { formatDimensions, formatWeight } from "../../libs/formaters";

const Products = () => {
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(false);
  const [productsCount, setproductsCount] = useState(); // State to store auction details
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCountState, setRowCountState] = React.useState(productsCount || 0);
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = token(theme.palette.mode);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      productsCount !== undefined ? productsCount : prevRowCountState
    );
  }, [productsCount, setRowCountState]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchProducts(paginationModel.pageSize, paginationModel.page)
      .then((res) => {
        console.log(paginationModel);
        setproductsCount(res.data.count);
        console.log(res.data.productList);
        setProducts(res.data.productList);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setProducts([]);
      console.log("unmount products");
    };
  }, [paginationModel]);

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
    // Set isLoadingProductDetails to true when loading starts
    setIsLoadingProductDetails(true);

    // Fetch product details
    fetchProduct(productId)
      .then((res) => {
        console.log(res.data);
        setProductDetails(res.data);
        // Set isLoadingProductDetails to false when loading is complete
        setIsLoadingProductDetails(false);
      })
      .catch((err) => {
        console.log(err);
        // Set isLoadingProductDetails to false on error as well
        setIsLoadingProductDetails(false);
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
      flex: 1,
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
          <Header title={"Danh sách sản phẩm"} />
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
            rowCount={rowCountState}
            // loading={isLoad}
            pageSizeOptions={[1, 2, 3, 10]}
            paginationModel={paginationModel}
            paginationMode='server'
            onPaginationModelChange={setPaginationModel}
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
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={"20px"}>
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

                    <Typography variant='h5'>
                      {productDetails.origin}
                    </Typography>
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

                  <Box>
                    <Typography variant='h5' fontWeight={"bold"}>
                      Đánh giá
                    </Typography>

                    <Typography variant='h5'>
                      {productDetails.ratings}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
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

export default Products;
