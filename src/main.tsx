import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { CutProvider } from "./modules/cut/cut-provider";
import { AnimationProvider } from "./providers/animation-provider";

import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnimationProvider>
      <CutProvider>
        <App />
      </CutProvider>
    </AnimationProvider>
  </React.StrictMode>
);
