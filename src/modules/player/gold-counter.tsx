import GoldIcon from "@/assets/icons/gold-coin.png";

export const GoldCounter = ({ gold }: { gold: number }) => {
  return (
    <span className="flex  items-center">
      <img width={24} src={GoldIcon} />

      <span className="pt-[0.5px]">{gold}</span>
    </span>
  );
};
