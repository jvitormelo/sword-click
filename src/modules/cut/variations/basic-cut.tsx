import { useEffect } from "react";
import { useCutActions } from "../../../store/cut-store";
import { Cut } from "../types";

type CutWithoutType = Omit<Cut, "type">;

export const BasicCut = ({ position, id }: CutWithoutType) => {
  const { removeCut } = useCutActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeCut(id);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="text-xl bg-blue-500 w-4 h-4  cursor-pointer"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};
