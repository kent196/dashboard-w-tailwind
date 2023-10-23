import authAxios from "../api/authAxios";
import publicAxios from "../api/publicAxios";

const fetchProducts = async (pageSize, pageNumber) => {
  const path = `/product?type=1&PageSize=${pageSize}&PageNumber=${
    pageNumber + 1
  }`;

  // api call
  try {
    const response = await publicAxios.get(path);
    if (!response.data) {
      throw new Error("Error");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const fetchAuctionProducts = async () => {
  const path = "/product?type=2";

  // api call
  try {
    const response = await publicAxios.get(path);
    if (!response.data) {
      throw new Error("Error");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchProduct = async (id) => {
  // api call
  try {
    const response = await publicAxios.get(`/product/${id}`);
    if (!response.data) {
      throw new Error("Error");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { fetchProducts, fetchProduct, fetchAuctionProducts };
