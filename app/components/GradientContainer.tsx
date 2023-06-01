import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export default function GradientContainer({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg ${className} bg-gradient-to-b from-[#27234a] to-[#1a153a]`}
      {...props}
    >
      {children}
    </div>
  );
}
