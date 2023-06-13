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
import { Models, Query } from "appwrite";
import DivWrapper from "app/components/DivWrapper";
import { trpc } from "utils/trpc";
import { inter } from "app/fonts";
import { SelectSeparator } from "app/components/ui/select";

function ChallengeThread({ params: { id } }: { params: { id: string } }) {
  const [challengeMessage, setChallengeMessage] = useState<string>("");
  const [challengerMessages, setChallengerMessages] = useState<
    {
      msg: string;
      author: any;
    }[]
  >([]);
  const { socket } = useSocket();
  const user = useStore((state) => state.user);
  const [currentUserChallengeStatus, setCurrentUserChallengeStatus] = useState<
    "challenger" | "challenged"
  >();

  const { data: currentChallenge } = useQuery({
    queryKey: ["user", user],
    queryFn: async function fetchCurrentChallenge() {
      const currentChallenge = await appwriteDatabase.getDocument(
        hottakesDatabaseId,
        Collections["Challenges"],
        id
      );
      if (currentChallenge.challenger === user.userId) {
        setCurrentUserChallengeStatus("challenger");
      } else if (currentChallenge.challenged === user.userId) {
        setCurrentUserChallengeStatus("challenged");
      }
      return currentChallenge;
    },
  });

  const { data: otherUser } = trpc.getUsers.useQuery({
    userId:
      currentUserChallengeStatus === "challenged"
        ? currentChallenge?.challenger
        : currentChallenge?.challenged,
  });

  // user data for the "challenged" user
  const { data: challenged } = trpc.getUsers.useQuery({
    userId: currentChallenge?.challenged,
  });

  // user data for the "challenger" user
  const { data: challenger } = trpc.getUsers.useQuery({
    userId: currentChallenge?.challenger,
  });

  // recieves "takes" from the challenger/challenged
  socket?.on(
    "broadcast-challenge-message",
    ({
      challenge,
      challengeMessage,
      from,
      to,
    }: {
      challenge: Models.Document;
      challengeMessage: string;
      from: any;
      to: any;
    }) => {
      if (
        challenge.challenger === user.userId ||
        (challenge.challenged === user.userId &&
          challenge.$id === currentChallenge?.$id)
      ) {
        setChallengerMessages([
          ...challengerMessages,
          {
            author: from,
            msg: challengeMessage,
          },
        ]);
      }
    }
  );

  function findAuthorOfTakes(currentUserId: string) {
    return currentUserId === challenger?.user?.$id
      ? challenger
      : currentUserId === challenged?.user?.$id
      ? challenged
      : null;
  }

  // fetches all the stored "takes" from db
  useQuery({
    queryKey: [
      "currentChallenge",
      currentChallenge,
      "challenger",
      challenger,
      "challenged",
      challenged,
    ],
    queryFn: async function fetchChallengeDiscussions() {
      const { documents } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Challenge Discussions"],
        [Query.equal("challenges", [currentChallenge?.$id || ""])]
      );
      // fetching all the messages from db
      if (challenged && challenger) {
        setChallengerMessages([
          ...challengerMessages,
          ...documents.map((document) => ({
            author: findAuthorOfTakes(document.sender),
            msg: document.take,
          })),
        ]);
      }
      return documents;
    },
  });

  function findOtherUser() {
    return user.userId === challenged?.user?.$id
      ? challenger?.user
      : challenged?.user;
  }

  async function handleSend() {
    setChallengerMessages([
      ...challengerMessages,
      {
        author: findAuthorOfTakes(user.userId),
        msg: challengeMessage,
      },
    ]);
    socket?.emit("send-challenge-message", {
      challenge: currentChallenge,
      challengeMessage,
      from: findAuthorOfTakes(user.userId),
      to: findOtherUser(),
    });
    appwriteDatabase.createDocument(
      hottakesDatabaseId,
      Collections["Challenge Discussions"],
      "",
      {
        challenges: currentChallenge?.$id,
        take: challengeMessage,
        sender: user.userId || "",
        receiver: findOtherUser()?.$id,
      }
    );
    setChallengeMessage("");
  }

  function isParticipant(userId: string): boolean {
    return (
      userId === currentChallenge?.challenged ||
      userId === currentChallenge?.challenger
    );
  }

  return (
    <UIWrapper className="pl-0 pr-0">
      <div className="flex h-[84vh] flex-col gap-5 overflow-auto pl-[3%] pr-[3%]">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-400">Challenge #{id}</p>
          <h1
            className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
          >
            {currentChallenge?.discussion.discussionTopics.topic}
          </h1>
          <p className="text-gray-400">
            {currentChallenge?.discussion.discussionTopics?.description}
          </p>
          <div className="flex gap-3 text-gray-400">
            <p>
              Challenger:{" "}
              <span className="font-semibold text-white">
                {currentChallenge?.challenger === user.userId
                  ? "You"
                  : findOtherUser()?.name}
              </span>
            </p>
            <p>
              Challenged:{" "}
              <span className="font-semibold text-white">
                {currentChallenge?.challenged === user.userId
                  ? "You"
                  : findOtherUser()?.name}
              </span>
            </p>
          </div>
          <p className="mt-3 font-semibold">Challenged Discussion:</p>
          <p className="text-gray-400">
            {currentChallenge?.discussion.description}
          </p>
          <SelectSeparator className="mt-5 bg-btn_secondary" />
        </div>
        <p className="text-sm text-gray-400">CHALLENGE TAKES</p>
        <div className="mb-10 flex flex-col gap-3">
          {challengerMessages.map(({ author, msg }, i) => (
            <DivWrapper key={i}>
              <p>
                {author?.user?.$id === user.userId ? "You" : author?.user?.name}
              </p>
              <p className="text-gray-400">{msg}</p>
            </DivWrapper>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 h-[9.2vh] w-full rounded-lg rounded-t-none border-t-2 border-btn_secondary bg-secondary pl-[2em] pr-[2em]">
        {isParticipant(user.userId) &&
          (challengerMessages[challengerMessages?.length - 1]?.author?.user
            ?.$id !== user.userId ? (
            <div className="flex h-full w-full gap-3">
              <Input
                placeholder="Your Take"
                disabled={
                  !currentChallenge ||
                  challengerMessages[challengerMessages?.length - 1]?.author ===
                    user.userId
                }
                value={challengeMessage}
                className="h-[50%] self-center"
                onChange={(e: any) => setChallengeMessage(e.target.value)}
              />
              <Button
                variant="primary"
                className="h-[50%] w-[8rem] gap-3 self-center"
                disabled={
                  !currentChallenge ||
                  challengerMessages[challengerMessages?.length - 1]?.author ===
                    user.userId
                }
                onClick={handleSend}
              >
                <Send size="1rem" />
                Send
              </Button>
            </div>
          ) : (
            <div className="flex h-full w-full justify-center">
              <p className="self-center text-gray-400">
                Please wait for your turn to reply
              </p>
            </div>
          ))}
      </div>
    </UIWrapper>
  );
}

export default ({ params: { id } }: { params: { id: string } }) => (
  <WithAuth WrappedComponent={ChallengeThread} {...{ params: { id } }} />
);
