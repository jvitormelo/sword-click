import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { CutProvider } from "./modules/cut/cut-provider";
import { AnimationProvider } from "./providers/animation-provider";

import { App } from "./App";
import { ModalProvider } from "./providers/modal-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <div className="pointer-events-none select-none">
      <CutProvider />
      <AnimationProvider />
    </div>
    <ModalProvider />
  </React.StrictMode>
);
