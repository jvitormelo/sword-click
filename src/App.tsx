import { useCallback } from "react";
import { useEventListener } from "./hooks/useEventListener";
import { CutType } from "./modules/cut/types";
import { useCutActions } from "./store/cut-store";

function App() {
  const { addCut } = useCutActions();
  const onClick = useCallback(
    (e: PointerEvent) => {
      console.log(e);

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
    <main className="flex h-screen items-center justify-center w-full">
      <div className="text-xl bg-white w-52 h-52 cursor-pointer" />
    </main>
  );
}

export default App;
