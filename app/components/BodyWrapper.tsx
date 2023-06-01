import { PropsWithChildren } from "react";

export default function BodyWrapper({ children }: PropsWithChildren) {
  return <div className="m-auto w-[90em]">{children}</div>;
}
