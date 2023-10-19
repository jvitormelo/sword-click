import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { CutProvider } from "./modules/cut/cut-provider";
import { AnimationProvider } from "./providers/animation-provider";

import { QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { queryClient } from "./lib/query-client";
import { GameLoader } from "./providers/game-loader";
import { ModalProvider } from "./providers/modal-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GameLoader>
        <App />
      </GameLoader>
      <div className="pointer-events-none select-none">
        <CutProvider />
        <AnimationProvider />
      </div>
      <ModalProvider />
    </QueryClientProvider>
  </React.StrictMode>
);
