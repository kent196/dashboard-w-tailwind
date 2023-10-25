import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { SignalRProvider } from "./context/SignalRContext";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SignalRProvider>
      <Router>
        <App />
      </Router>
    </SignalRProvider>
  </React.StrictMode>
);
