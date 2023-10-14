import { useCallback } from "react";
import { useEventListener } from "./hooks/useEventListener";
import { useCutActions } from "./modules/cut/cut-store";
import { CutType } from "./modules/cut/types";
import { GameMap } from "./game-map";

function App() {
  const { addCut } = useCutActions();
  const onClick = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;

      addCut({
        position: { x: clientX, y: clientY },
        id: Math.random().toString(),
        type: CutType.Basic,
      });
    },

    [addCut]
  );

  useEventListener("click", onClick);

  return (
    <main className="flex h-screen items-center justify-center w-full  cursor-pointer">
      <div className="p-4 bg-white border border-black">
        <GameMap />
      </div>
    </main>
  );
}

export default App;
