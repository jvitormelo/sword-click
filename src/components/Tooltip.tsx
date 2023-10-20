import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  content: ReactNode;
};

export const Tooltip = ({ children, content }: Props) => {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute z-10 top-0 translate-y-[-120%] translate-x-[-30%] hidden group-hover:block [&>*]:bg-gray-800 text-white text-sm [&>*]:p-2 [&>*]:border [&>*]:rounded-md ">
        {content}
      </div>
    </div>
  );
};
