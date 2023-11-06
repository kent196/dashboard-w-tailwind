import authAxios from "../api/authAxios";
import publicAxios from "../api/publicAxios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fetchAuctions = async (pageSize, pageNumber) => {
  try {
    const response = await authAxios.get(
      `/auction/manager?PageSize=${pageSize}&PageNumber=${pageNumber + 1}`
    );
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchStaffAuctions = async (pageSize, pageNumber) => {
  try {
    // Send the GET request using the Axios instance
    const response = await authAxios.get(
      `/auction/staff?PageSize=${pageSize}&PageNumber=${pageNumber + 1}`
    );

    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchAuctionDetail = async (id) => {
  try {
    const response = await publicAxios.get(`/auction/${id}`);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchBidders = async (id) => {
  try {
    const response = await publicAxios.get(`/bid/auction/${id}?status=1`);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const addStaffToHost = async (auctionId, staffId) => {
  const path = `/auction/assign?id=${auctionId}&staffId=${staffId}`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const auctionApproval = async (auctionId, startedDate, endedDate) => {
  const path = `/auction/staff/approve/${auctionId}?startedAt=${startedDate}&endedAt=${endedDate}`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
const auctionReject = async (auctionId) => {
  const path = `/auction/staff/reject/${auctionId}`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const managerApproval = async (auctionId) => {
  const path = `/auction/manager/approve/${auctionId}`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const managerReject = async (auctionId) => {
  const path = `/auction/manager/reject/${auctionId}`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateAuctionInfo = async (auctionId, formData) => {
  const path = `/auction/staff/info/${auctionId}`;
  try {
    const response = await authAxios.post(path, formData);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchAuctionRegisters = async (auctionId) => {
  const path = `/bid/auction/${auctionId}?status=3`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const endAuction = async (auctionId) => {
  const path = `/auction/end/${auctionId}`;
  try {
    const response = await authAxios.get(path);
    if (!response.data) {
      console.log("No data");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  endAuction,
  fetchAuctions,
  fetchAuctionDetail,
  fetchBidders,
  fetchStaffAuctions,
  addStaffToHost,
  auctionApproval,
  auctionReject,
  managerApproval,
  managerReject,
  updateAuctionInfo,
  fetchAuctionRegisters,
};
