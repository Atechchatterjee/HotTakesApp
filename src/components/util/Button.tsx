import React, { PropsWithChildren } from "react";
import clsx from "clsx";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
}

const Button = ({
  variant = "secondary",
  children,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <button
      className={clsx(
        "rounded-sm",
        variant == "primary" ? "bg-primary" : "bg-secondary",
        "p-14 pb-4 pt-4 text-center"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
