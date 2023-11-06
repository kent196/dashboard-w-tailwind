import authAxios from "../api/authAxios";
import publicAxios from "../api/publicAxios";

const fetchUsers = async (pageSize, pageNumber) => {
  try {
    const response = await publicAxios.get(
      `/user?PageSize=${pageSize}&PageNumber=${pageNumber}`
    );
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchAllStaffs = async (pageSize, pageNumber) => {
  try {
    const response = await authAxios.get(
      `/staff?PageSize=${pageSize}&PageNumber=${pageNumber}`
    );
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchStaffs = async () => {
  try {
    const response = await authAxios.get("/staff/available");
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCustomer = async (pageSize, pageNumber) => {
  try {
    const response = await authAxios.get(
      `/user/customer?PageSize=${pageSize}&PageNumber=${pageNumber}`
    );
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchUserDetails = async (id) => {
  try {
    const response = await authAxios.get(`/user/${id}`);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (data) => {
  try {
    const response = await authAxios.post(`/user/profile`, data);
    if (!response.data) {
      console.log("No data");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const deactivateAccount = async (id) => {
  try {
    const response = await authAxios.get(`/user/deactivate/${id}`);
    if (!response.data) {
      console.log("No data");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUserPassword = async (data) => {
  try {
    const response = await authAxios.post(`/user/password`, data);
    if (!response.data) {
      console.log("No data");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  fetchUsers,
  fetchStaffs,
  fetchCustomer,
  fetchUserDetails,
  fetchAllStaffs,
  updateProfile,
  deactivateAccount,
  updateUserPassword,
};
