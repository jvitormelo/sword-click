import { cn } from "@/utils/cn";
import { AnySkill, SkillActivationType } from "./types";
import { Tooltip } from "@/components/Tooltip";

type Props = {
  skill: AnySkill;
  onClick?: (skill: AnySkill) => void;
  active: boolean;
};

export const SkillIcon = ({ skill, onClick, active }: Props) => {
  return (
    <Tooltip
      content={
        <div className="w-48 ">
          <div className="font-bold">{skill.name}</div>
          <div className="text-xs">{skill.description}</div>
          {skill.type === SkillActivationType.Active && (
            <>
              <div className="text-xs">
                Damage: {skill.damage[0]}-{skill.damage[1]}
              </div>
              <div className="text-xs text-blue-500">Cost: {skill.cost}</div>
            </>
          )}
        </div>
      }
    >
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
    </Tooltip>
  );
};
