import { HTMLAttributes } from "react";
import Sidebar from "./Sidebar";
import { cn } from "lib/utils";

export default function UIWrapper({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="h-[100svh] bg-secondary" {...props}>
      <Sidebar />
      <div
        className={cn(
          "fixed top-[0] z-[100] ml-[18%] mt-[0.85em] h-[97svh] w-[81%] overflow-y-auto rounded-xl border border-btn_secondary bg-background pl-[4%] pr-[4%] pt-[2%] shadow-xl shadow-background",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
