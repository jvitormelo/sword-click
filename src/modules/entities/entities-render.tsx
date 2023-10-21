import { useGameLevelStore } from "@/modules/level/game-level-store";
import { AnimationObject } from "@/modules/skill/types";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";

export const EntitiesRender = () => {
  const entities = useGameLevelStore((s) => s.entities);

  const entitiesArray = useMemo(
    () => Array.from(entities.values()),
    [entities]
  );

  return (
    <AnimatePresence>
      {entitiesArray.map((entity) => (
        <SpawnedEntity
          key={entity.id}
          animation={entity.animationObject}
          sound={entity.sound}
        />
      ))}
    </AnimatePresence>
  );
};

const SpawnedEntity = memo(
  ({ animation, sound }: { sound: string; animation: AnimationObject }) => {
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
        <motion.img {...animation} />
      </>
    );
  }
);

SpawnedEntity.displayName = "SpawnedEntity";
