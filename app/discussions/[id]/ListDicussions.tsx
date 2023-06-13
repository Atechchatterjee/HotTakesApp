"use client";
import { Button } from "app/components/ui/button";
import { Models, Query } from "appwrite";
import { useContext, useEffect, useState } from "react";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import { useToast } from "app/components/ui/use-toast";
import { useStore } from "store";
import { SelectSeparator } from "app/components/ui/select";
import { trpc } from "utils/trpc";
import clsx from "clsx";
import DivWrapper from "app/components/DivWrapper";
import { RefetchContext } from "context/RefetchContext";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "utils/useSocket";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

function DisplayUser({
  className,
  userId,
  ...props
}: { userId: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  let { data } = trpc.getUsers.useQuery({ userId: userId });

  return (
    <p className={clsx("text-lg font-semibold", className)} {...props}>
      {data?.user?.name}
    </p>
  );
}

export default function ListDiscussions({ id }: { id: string }) {
  const [discussions, setDiscussions] = useState<Models.Document[]>([]);
  const [discussionChallenged, setDiscussionChallenged] =
    useState<Models.Document | null>(null);
  // contains all the challenges the current user has for the given discussion
  const [challengeList, setChallengeList] = useState<
    Map<string, Models.Document[]>
  >(new Map());
  const [broadcastedChallenge, setBroadcasetedChallenge] =
    useState<Models.Document>();

  const { refetch, setRefetch } = useContext(RefetchContext);
  const { socket } = useSocket();
  const { toast } = useToast();
  const router = useRouter();

  const user = useStore((state) => state.user);

  socket?.on("challenge-broadcast", ({ challenge }) => {
    console.log("challenge", challenge);
    setBroadcasetedChallenge(challenge);
  });

  useEffect(() => {
    if (broadcastedChallenge) {
      if (broadcastedChallenge?.challenged === user.userId) {
        toast({
          variant: "success",
          style: {
            position: "fixed",
            width: "30rem",
            top: "1rem",
            right: "1rem",
          },
          title: "Your Discussion has been challenged",
          description: `Your Discussion: ${broadcastedChallenge?.discussion.description} has been challenged`,
        });
      }
    }
  }, [broadcastedChallenge]);

  useQuery({
    queryKey: ["refetch", refetch],
    queryFn: async () => {
      const { documents: discussions } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Discussion"],
        [Query.equal("discussionTopics", [id])]
      );
      setDiscussions(discussions);
      setRefetch(false);
    },
  });

  useQuery({
    queryKey: ["discussions", discussions, refetch],
    queryFn: async function fetchAllChallengedDiscusssions() {
      // fetches all the challenges where the current user is the challenger
      const { documents: challengeList } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Challenges"],
        [
          Query.equal("challenger", [user.userId]),
          Query.equal(
            "discussion",
            discussions.map((discussion) => discussion.$id)
          ),
        ]
      );
      const map = new Map();
      challengeList.forEach((challenge) => {
        map.set(challenge.discussion.$id, challenge);
      });
      console.log({ map });
      setChallengeList(map);
      setRefetch(false);
      return challengeList;
    },
  });

  useQuery({
    queryKey: ["discussionChallenged", discussionChallenged || ""],
    queryFn: async function challengeDiscussion() {
      if (!!discussionChallenged) {
        setDiscussionChallenged(null);
        const promise = await appwriteDatabase.createDocument(
          hottakesDatabaseId,
          Collections["Challenges"],
          "",
          {
            challenged: discussionChallenged.user,
            challenger: user.userId,
            discussion: discussionChallenged.$id,
          }
        );
        socket?.emit("challenged", {
          challenge: promise,
        });
        setRefetch(true);
        return promise;
      }
    },
  });

  const { data: challengeThreadIds } = useQuery({
    queryKey: ["refetch", refetch, "user", user, "discussions", discussions],
    queryFn: async function fetchChallengeThreadId() {
      if (discussions) {
        const { documents: challenges } = await appwriteDatabase.listDocuments(
          hottakesDatabaseId,
          Collections["Challenges"],
          [
            Query.equal(
              "discussion",
              discussions.map((discussion) => discussion.$id)
            ),
            Query.equal("challenger", user.userId),
          ]
        );
        console.log({ challenges });
        let challengeThreadIds = new Map<string, string>();
        challenges.forEach((challenge) => {
          if (challenge.accepted)
            challengeThreadIds.set(challenge.discussion.$id, challenge.$id);
        });
        return challengeThreadIds;
      }
      return new Map<string, string>();
    },
  });

  return (
    <div className="mt-10 flex flex-col gap-5 pb-10">
      <SelectSeparator className="bg-btn_secondary" />
      <p className="text-[0.9rem] font-medium text-gray-400">DISCUSSIONS</p>
      {discussions.length === 0 && (
        <p className="text-gray-400">No Discussions Yet!</p>
      )}
      {discussions.map((discussion, i) => (
        <DivWrapper highlight={user.userId === discussion.user} key={i}>
          {user.userId === discussion.user ? (
            <p className="text-lg font-semibold">YOU</p>
          ) : (
            <DisplayUser userId={discussion.user} />
          )}
          <p className="text-gray-400">{discussion.description}</p>
          <div className="mt-[2rem] flex gap-3 ">
            {user.userId !== discussion.user && (
              <Button
                variant="primary"
                disabled={challengeList.has(discussion.$id)}
                className="w-[8rem]"
                onClick={() => setDiscussionChallenged(discussion)}
              >
                {challengeList.has(discussion.$id) ? "Challenged" : "Challenge"}
              </Button>
            )}
            {challengeThreadIds?.has(discussion.$id) && (
              <Button
                variant="secondary"
                className="w-[12rem] gap-2"
                onClick={() => {
                  router.push(
                    `/challenges/${challengeThreadIds.get(discussion.$id)}`
                  );
                }}
              >
                <ExternalLink size="1rem" />
                Challenge thread
              </Button>
            )}
          </div>
        </DivWrapper>
      ))}
    </div>
  );
}
