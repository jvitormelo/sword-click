import { AnimationObject } from "@/modules/skill/types";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import { useAnimationStore } from "./animation-store";

export const AnimationRender = () => {
  const { animations } = useAnimationStore();

  const arr = useMemo(() => Array.from(animations), [animations]);

  return (
    <AnimatePresence>
      {arr.map(([key, animation]) => (
        <Animation key={key} {...animation} />
      ))}
    </AnimatePresence>
  );
};

const Animation = memo((props: AnimationObject) =>
  props.src ? <motion.img {...props} /> : <motion.div {...props} />
);

Animation.displayName = "Animation";
