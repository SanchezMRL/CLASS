import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import { ConfigProvider } from "./context/ConfigContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <ConfigProvider>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </ConfigProvider>
  </AuthProvider>
);
