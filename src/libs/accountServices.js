import authAxios from "../api/authAxios";
import publicAxios from "../api/publicAxios";

const fetchUserData = async () => {
  try {
    // Fetch the user data to get the user's ID
    const userResponse = await authAxios.get("/user/current");

    if (userResponse.status === 200) {
      console.log("User Data:", userResponse.data);
      const { id, role } = userResponse.data.data;

      // Store the user's ID in localStorage
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);
      console.log("User role:", role);
      console.log("User ID:", id);
      return userResponse.data;
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const createAccount = async (data) => {
  try {
    if (data === null || data === undefined) {
      console.log("No data provided");
    }
    const response = await authAxios.post("/admin/staff", data);
    // if (response.status === 200) {
    //   console.log("Account created successfully");
    //   return response;
    // } else {
    //   console.error("Failed to create account");
    //   return response;
    // }
    console.log("aaa");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("An error occurred: as", error);
    return error;
  }
};

export { fetchUserData, createAccount };
