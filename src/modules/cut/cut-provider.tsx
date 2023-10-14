import { PropsWithChildren } from "react";
import { useCutStore } from "./cut-store";
import { CutMapper } from "./cut-mapper";

export const CutProvider = ({ children }: PropsWithChildren) => {
  const { cuts } = useCutStore();
  return (
    <>
      {cuts.map((cut) => (
        <CutMapper key={cut.id} {...cut} />
      ))}
      {children}
    </>
  );
};
