import { cn } from "@/utils/cn";
import { AnySkill, SkillActivationType } from "../types";
import { Tooltip } from "@/components/Tooltip";
import { useSkillStore } from "@/modules/skill/skill-store";
import { useEffect, useState } from "react";

type Props = {
  skill: AnySkill;
  onClick?: (skill: AnySkill) => void;
  active: boolean;
};

export const SkillIcon = ({ skill, onClick, active }: Props) => {
  return (
    <Tooltip
      content={
        <div className="w-48 relative">
          <div className="font-bold">{skill.name}</div>
          <div className="text-xs">{skill.description}</div>
          {skill.type === SkillActivationType.Active && (
            <>
              <div className="text-xs">
                Damage: {skill.damage.value[0]}-{skill.damage.value[1]}
              </div>
              <div className="text-xs text-blue-500">Cost: {skill.cost}</div>
              <div className="text-xs">Damage Type: {skill.damage.type}</div>
            </>
          )}
        </div>
      }
    >
      <div className="relative w-12 h-12">
        {skill.coolDown ? <CdCountdown skill={skill}></CdCountdown> : null}
        <img
          data-active={active}
          onClick={() => onClick?.(skill)}
          key={skill.id}
          className={cn(
            "w-12 h-12 rounded-md cursor-pointer border-white border",
            active && "border-2 border-amber-800",
            skill.type === SkillActivationType.Passive &&
              !onClick &&
              "border-blue-500 cursor-default"
          )}
          src={skill.icon}
          alt={skill.name}
        />
      </div>
    </Tooltip>
  );
};

const CdCountdown = ({ skill }: { skill: AnySkill }) => {
  const history = useSkillStore((s) => s.lastUsedSkills);
  const lastUsed = history.get(skill.id);

  if (!lastUsed || !skill.coolDown) return null;

  const now = Date.now();

  const availableWhen = lastUsed + skill.coolDown;

  if (now > availableWhen) return null;

  return <Timer coolDown={skill.coolDown} lastUsed={lastUsed} />;
};

const Timer = ({
  coolDown,
  lastUsed,
}: {
  lastUsed: number;
  coolDown: number;
}) => {
  const seconds = Math.floor((coolDown - (Date.now() - lastUsed)) / 1000);

  const [, rerender] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      rerender((v) => v + 1);
      if (seconds <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  if (seconds <= 0) return null;

  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
      className="absolute w-full h-full flex text-xl text-white items-center justify-center "
    >
      {seconds}
    </div>
  );
};
