import authAxios from "../api/authAxios";
import Error from "../global/Error";

const fetchSellerRequests = async (pageSize, page) => {
  const rs = await authAxios.get(
    `/seller/request?PageSize=${pageSize}&PageNumber=${page}`
  );
  if (!rs.data) {
    return <Error />;
  }
  console.log(rs.data);
  return rs.data;
};

const rejectSellerRequest = async (id) => {
  const rs = await authAxios.get(`/user/seller/reject?id=${id}`);
  if (!rs.data) {
    return <Error />;
  }
  console.log(rs.data);
  return rs.data;
};

const acceptSellerRequest = async (id) => {
  const rs = await authAxios.get(`/user/seller/approve?id=${id}`);
  if (!rs.data) {
    return <Error />;
  }
  console.log(rs.data);
  return rs.data;
};
export { fetchSellerRequests, rejectSellerRequest, acceptSellerRequest };
