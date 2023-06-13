"use client";
import { cn } from "lib/utils";
import { Button } from "./ui/button";
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from "react-icons/tb";
import { useEffect, useState } from "react";

export default function Vote({
  className,
  voteState,
  onVote,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  voteState?: [
    "up" | "down" | undefined,
    React.Dispatch<React.SetStateAction<"up" | "down" | undefined>>
  ];
  onVote?: (vote: "up" | "down") => void;
}) {
  function useConditionalState() {
    if (!!voteState) {
      return voteState;
    } else {
      return useState<"up" | "down">();
    }
  }
  const [vote, setVote] = useConditionalState();

  // useEffect(() => {
  //   if (vote !== undefined && onVote) {
  //     alert("firing onVote");
  //     onVote(vote);
  //   }
  // }, [vote]);

  return (
    <div className={cn("flex", className)} {...props}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          vote === "up" && "bg-primary",
          "transition-all duration-300"
        )}
        onClick={() => {
          setVote("up");
          if (onVote) onVote("up");
        }}
      >
        <TbArrowBigUpFilled className={cn(vote === "up" && "text-white")} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          vote === "down" && "bg-primary",
          "transition-all duration-300"
        )}
        onClick={() => {
          setVote("down");
          if (onVote) onVote("down");
        }}
      >
        <TbArrowBigDownFilled className={cn(vote === "down" && "text-white")} />
      </Button>
    </div>
  );
}
