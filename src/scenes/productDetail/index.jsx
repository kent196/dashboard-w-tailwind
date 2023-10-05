import React from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { mockDataProducts } from "../../data/mockData";
import Header from "../../components/Header";
import { ArrowBack } from "@mui/icons-material";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = mockDataProducts.find(
    (productData) => productData.id === parseInt(id)
  );

  const handleBack = () => {
    navigate(`/products`);
  };
  function formatPrice(price) {
    // Convert price to VND format with commas for thousands
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  if (!product) {
    return <Box>Product not found</Box>;
  }

  return (
    <Container maxWidth='xl' sx={{ paddingTop: "20px" }}>
      <Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          gap={"20px"}
          flex={"1"}
          alignItems={"center"}>
          <Box>
            <IconButton onClick={handleBack}>
              <ArrowBack />
            </IconButton>
          </Box>
          <Header title={"Product details"} />
        </Box>
        <Box display={"flex"} gap={"20px"} ml={"60px"}>
          <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Product Name
              </Typography>
              <Typography variant='h5'>{product.name}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Category
              </Typography>

              <Typography variant='h5'>{product.cateId}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Material
              </Typography>

              <Typography variant='h5'>{product.materialId}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Seller ID
              </Typography>

              <Typography variant='h5'>{product.sellerId}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Description
              </Typography>

              <Typography variant='h5'>{product.description}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Price
              </Typography>

              <Typography variant='h5'>{formatPrice(product.price)}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Dimension
              </Typography>

              <Typography variant='h5'>{product.dimension}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Weight
              </Typography>

              <Typography variant='h5'>{product.weight}</Typography>
            </Box>
          </Box>
          <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Origin
              </Typography>

              <Typography variant='h5'>{product.origin}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Package Method
              </Typography>

              <Typography variant='h5'>{product.packageMethod}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Package Content
              </Typography>

              <Typography variant='h5'>{product.packageContent}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Condition
              </Typography>

              <Typography variant='h5'>{product.condition}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Product Type
              </Typography>

              <Typography variant='h5'>
                {product.type === 0 ? "For sale" : "For auction"}
              </Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Status
              </Typography>

              <Typography variant='h5'>{product.status}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Ratings
              </Typography>

              <Typography variant='h5'>{product.ratings}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Create Date
              </Typography>

              <Typography variant='h5'>{product.createdAt}</Typography>
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={"bold"}>
                Update Date
              </Typography>

              <Typography variant='h5'>{product.updatedAt}</Typography>
            </Box>
          </Box>
        </Box>
        <Box ml={"60px"}>
          <Button color='error' variant='contained'>
            Delete
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
