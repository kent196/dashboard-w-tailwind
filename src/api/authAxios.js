import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api`;
// const BASE_URL = "https://localmart.site/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    console.log("res err interceptors");
    console.log(err);
    const originalConfig = err.config;

    if (
      originalConfig.url !== "/login" &&
      originalConfig.url !== "/" &&
      err.response
    ) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        console.log("refresh token");
        originalConfig._retry = true;

        try {
          const rs = await axios.post(`${BASE_URL}/refresh`, {
            accessToken: localStorage.getItem("accessToken"),
            refreshToken: localStorage.getItem("refreshToken"),
          });

          const { accessToken, refreshToken } = rs.data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          return instance(originalConfig);
        } catch (_error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
