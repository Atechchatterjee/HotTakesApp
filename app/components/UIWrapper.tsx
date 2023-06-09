import { HTMLAttributes } from "react";
import Sidebar from "./Sidebar";

export default function UIWrapper({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="h-[100svh] bg-secondary" {...props}>
      <Sidebar />
      <div className="fixed top-[0] z-[100] ml-[18%] mt-[0.85em] h-[97svh] w-[81%] overflow-y-auto rounded-xl border border-btn_secondary bg-background pl-[4%] pr-[4%] pt-[2%] shadow-xl shadow-background">
        {children}
      </div>
    </div>
  );
}
