import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CutProvider } from "./modules/cut/cut-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CutProvider>
      <App />
    </CutProvider>
  </React.StrictMode>
);
