import { cn } from "@/utils/cn";
import { PropsWithChildren, forwardRef } from "react";

type DIVProps = JSX.IntrinsicElements["div"];

export const Card = forwardRef<HTMLDivElement, PropsWithChildren<DIVProps>>(
  ({ children, className, ...rest }: PropsWithChildren & DIVProps, ref) => {
    return (
      <div
        {...rest}
        className={cn(
          "flex flex-col bg-slate-950 border border-amber-800 p-4 rounded-md",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
