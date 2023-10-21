import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { SkillTrigger } from "@/modules/skill/skill-trigger";
import { QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { queryClient } from "./lib/query-client";
import { SkillOverlay } from "./modules/skill/skill-overlay";
import { GameLoader } from "./providers/game-loader";
import { ModalProvider } from "./providers/modal-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GameLoader>
        <App />
      </GameLoader>
      <div className="pointer-events-none select-none">
        <SkillOverlay />

        <SkillTrigger />
      </div>
      <ModalProvider />
    </QueryClientProvider>
  </React.StrictMode>
);
