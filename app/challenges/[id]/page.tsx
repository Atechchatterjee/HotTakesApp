"use client";
import { useQuery } from "@tanstack/react-query";
import UIWrapper from "app/components/UIWrapper";
import WithAuth from "app/components/WithAuth";
import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Send } from "lucide-react";
import { appwriteDatabase } from "utils/appwriteConfig";
import { hottakesDatabaseId } from "utils/appwriteConfig";
import { useSocket } from "utils/useSocket";
import Collections from "utils/appwriteCollections";
import { useState } from "react";
import { useStore } from "store";
import { Models } from "appwrite";
import DivWrapper from "app/components/DivWrapper";
import { trpc } from "utils/trpc";
import clsx from "clsx";

function DisplayUser({
  className,
  userId,
  ...props
}: { userId: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  let { data } = trpc.getUsers.useQuery({ userId: userId });

  return (
    <p className={clsx("font-semibold", className)} {...props}>
      {!data ? "...loading" : data?.user?.name}
    </p>
  );
}

function ChallengeThread({ params: { id } }: { params: { id: string } }) {
  const [challengeMessage, setChallengeMessage] = useState<string>("");
  const [challengerMessages, setChallengerMessages] = useState<
    { msg: string; author: string }[]
  >([]);
  const { socket } = useSocket();
  const user = useStore((state) => state.user);

  const { data: currentChallenge } = useQuery({
    queryFn: async function fetchCurrentChallenge() {
      return await appwriteDatabase.getDocument(
        hottakesDatabaseId,
        Collections["Challenges"],
        id
      );
    },
  });

  socket?.on(
    "broadcast-challenge-message",
    ({
      currentChallenge,
      challengeMessage,
    }: {
      currentChallenge: Models.Document;
      challengeMessage: string;
    }) => {
      if (
        currentChallenge.challenger === user.userId ||
        currentChallenge.challenged === user.userId
      ) {
        // if I am the the challenger then user that send the message must be the challenged
        if (user.userId === currentChallenge.challenger) {
          setChallengerMessages([
            ...challengerMessages,
            { author: currentChallenge.challenged, msg: challengeMessage },
          ]);
        } else {
          setChallengerMessages([
            ...challengerMessages,
            { author: currentChallenge.challenger, msg: challengeMessage },
          ]);
        }
      }
    }
  );

  async function handleSend() {
    setChallengerMessages([
      ...challengerMessages,
      { author: user.userId, msg: challengeMessage },
    ]);
    setChallengeMessage("");
    socket?.emit("send-challenge-message", {
      currentChallenge,
      challengeMessage,
    });
  }

  return (
    <UIWrapper className="pl-0 pr-0">
      <div className="flex flex-col gap-5 pl-[3%] pr-[3%]">
        {challengerMessages.map(({ author, msg }, i) => (
          <DivWrapper key={i}>
            <DisplayUser userId={author} />{" "}
            {/* TODO: Make sure you change this as this is highly inefficient */}
            <p className="text-gray-400">{msg}</p>
          </DivWrapper>
        ))}
      </div>
      <div className="absolute bottom-0 flex w-full gap-3 rounded-lg bg-secondary pb-[1.5rem] pl-[3rem] pr-[3rem] pt-[1.5rem]">
        <Input
          placeholder="Your Take"
          value={challengeMessage}
          className="h-[3rem]"
          onChange={(e: any) => setChallengeMessage(e.target.value)}
        />
        <Button
          variant="primary"
          className="h-[3rem] w-[8rem] gap-3"
          onClick={handleSend}
        >
          <Send size="1rem" />
          Send
        </Button>
      </div>
    </UIWrapper>
  );
}

export default ({ params: { id } }: { params: { id: string } }) => (
  <WithAuth WrappedComponent={ChallengeThread} {...{ params: { id } }} />
);
