import clsx from "clsx";
import { PropsWithChildren } from "react";

export default function DivWrapper({
  className,
  children,
  highlight,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & { highlight?: boolean }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-lg border border-btn_secondary",
        highlight ? "bg-btn_secondary" : "bg-secondary",
        "pb-5 pl-7 pr-7 pt-5 transition-all duration-300 hover:brightness-[130%]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
