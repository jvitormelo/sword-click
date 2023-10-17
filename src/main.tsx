import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CutProvider } from "./modules/cut/cut-provider";
import { AnimationProvider } from "./animation-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnimationProvider>
      <CutProvider>
        <App />
      </CutProvider>
    </AnimationProvider>
  </React.StrictMode>
);
