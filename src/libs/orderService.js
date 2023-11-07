import aucthAxios from "../api/authAxios";
import publicAxios from "../api/publicAxios";

const fetchOrderDetails = async (orderId) => {
  const path = `/order/${orderId}`;
  try {
    const response = await aucthAxios.get(path);
    if (!response.data) {
      throw new Error("No data found");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchOrders = async (pageSize, page, status) => {
  const path = `/order?PageSize=${pageSize}&PageNumber=${page}&Status=${status}`;
  try {
    const response = await aucthAxios.get(path);
    if (!response.data) {
      throw new Error("No data found");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const fetchPageAmmount = async () => {
  const path = `/order`;
  try {
    const response = await aucthAxios.get(path);
    if (!response.data) {
      throw new Error("No data found");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { fetchOrderDetails, fetchOrders, fetchPageAmmount };
