import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { queryClient } from "./lib/query-client";
import { SkillOverlay } from "./modules/skill/skill-overlay";
import { GameLoader } from "./providers/game-loader";
import { ModalRender } from "./components/Modal/modal-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GameLoader>
        <App />
      </GameLoader>
      <div className="pointer-events-none select-none">
        <SkillOverlay />
      </div>
      <ModalRender />
    </QueryClientProvider>
  </React.StrictMode>
);
