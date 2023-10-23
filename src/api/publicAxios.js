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

export default instance;
