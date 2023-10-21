import { EntityOnLevel, useGameLevelStore } from "@/stores/game-level-store";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

export const EntitiesOnLevel = () => {
  const entities = useGameLevelStore((s) => s.entities);

  const entitiesArray = useMemo(() => {
    return Array.from(entities.values());
  }, [entities]);
  return (
    <AnimatePresence>
      {entitiesArray.map((entity) => (
        <SpawnedEntity key={entity.id} {...entity} />
      ))}
    </AnimatePresence>
  );
};

const SpawnedEntity = ({ image, size, position, sound }: EntityOnLevel) => {
  return (
    <>
      <audio
        src={sound}
        ref={(node) => {
          if (node) {
            node.volume = 0.5;
          }
        }}
        autoPlay
        hidden
      />
      <motion.img
        className="absolute rounded-full translate-x-1/2 animate-spin"
        animate={{
          translateX: [0, 10, 0],
          scale: [1, 1.1, 1],
          left: position.x,
          top: position.y,
        }}
        initial={{
          left: position.x,
          top: position.y,
        }}
        transition={{
          duration: 0.2,
          ease: "linear",
        }}
        width={size.width}
        height={size.height}
        src={image}
      />
    </>
  );
};
