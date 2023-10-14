import { memo } from "react";
import { Cut, CutType } from "./types";
import { BasicCut } from "./variations/basic-cut";

const cutMap = {
  [CutType.Basic]: BasicCut,
};

export const CutMapper = memo(({ type, ...props }: Cut) => {
  return cutMap[type] ? cutMap[type]({ ...props }) : null;
});
