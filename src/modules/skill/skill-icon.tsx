import { cn } from "@/utils/cn";
import { AnySkill, SkillType } from "./types";
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
          skill.type === SkillType.Passive &&
            !onClick &&
            "border-blue-500 cursor-default"
        )}
        src={skill.icon}
        alt={skill.name}
      />
    </Tooltip>
  );
};
