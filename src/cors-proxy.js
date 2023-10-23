const express = require("express");
const cors = require("cors");
const httpProxy = require("http-proxy");

const app = express();
const proxy = httpProxy.createProxyServer();

app.use(cors());

app.all("/api/*", (req, res) => {
  proxy.web(req, res, {
    target: "https://localhost:7139", // Your backend URL
    changeOrigin: true,
  });
});

const port = 3001; // Choose a port for your proxy
app.listen(port, () => {
  console.log(`CORS proxy server is running on port ${port}`);
});
