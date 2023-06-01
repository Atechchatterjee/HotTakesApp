import React, { PropsWithChildren } from "react";
import clsx from "clsx";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "secondary",
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <button
      className={clsx(
        "rounded-md transition-all duration-300",
        variant == "primary"
          ? "bg-primary hover:brightness-125"
          : "bg-btn_secondary hover:brightness-125",
        "p-10 pb-[1em] pt-[1em] text-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
