"use client";
import WithAuth from "app/components/WithAuth";
import UIWrapper from "app/components/UIWrapper";
import DivWrapper from "app/components/DivWrapper";
import { useQuery } from "@tanstack/react-query";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import { Models, Query } from "appwrite";
import { useStore } from "store";
import clsx from "clsx";
import { trpc } from "utils/trpc";
import { sora } from "app/fonts";
import { SelectSeparator } from "app/components/ui/select";
import { Button } from "app/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

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
/**
 *
 * @param challengeStatus
 * @description:
 * "challenged" -> displays the discussions the current
 *                 user has challenged
 * "challenger" -> displays the discussions the current
 *                 user has been challenged for
 */
function ListChallenges({
  challengeStatus,
}: {
  challengeStatus: "challenger" | "challenged";
}) {
  const user = useStore((state) => state.user);
  const router = useRouter();

  const { data: fetchedUserChallenges, refetch: refetchUserChallenges } =
    useQuery({
      queryKey: [user, challengeStatus],
      queryFn: async function fetchUserChallenges() {
        const { documents: fetchedUserChallenges } =
          await appwriteDatabase.listDocuments(
            hottakesDatabaseId,
            Collections["Challenges"],
            [
              Query.equal(
                challengeStatus === "challenged" ? "challenger" : "challenged",
                [user.userId]
              ),
            ]
          );
        return fetchedUserChallenges;
      },
    });

  async function handleChallegeAcceptance(challengeToAccept: Models.Document) {
    try {
      await appwriteDatabase.updateDocument(
        hottakesDatabaseId,
        Collections["Challenges"],
        challengeToAccept.$id,
        { accepted: true }
      );
      refetchUserChallenges();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-5 flex flex-col gap-5">
      {!fetchedUserChallenges && (
        <p className="text-gray-400">
          {challengeStatus === "challenged"
            ? "You have not challenged any discussions so far"
            : "None of your discussions have been challenged so far"}
        </p>
      )}
      {fetchedUserChallenges?.map((challenge, i) => (
        <DivWrapper
          key={i}
          className={clsx(
            challenge.accepted &&
              challengeStatus === "challenged" &&
              "border-primary",
            "gap-3"
          )}
        >
          <h2 className="text-[1.3rem] font-semibold">
            {challenge.discussion.discussionTopics.topic}
          </h2>
          <p className="text-gray-400">
            {challenge.discussion.discussionTopics.description}
          </p>
          <div className="flex gap-2 text-gray-400">
            <span className="self-center font-semibold text-white">
              {challengeStatus === "challenged"
                ? "You have challenged:"
                : "You have been challenged by:"}
            </span>
            <DisplayUser
              userId={
                challengeStatus === "challenged"
                  ? challenge.challenged
                  : challenge.challenger
              }
              className="self-center"
            />
          </div>
          <p className="font-semibold">
            {challengeStatus === "challenged"
              ? "Challenged User's Take"
              : "Your Take:"}
          </p>
          <p className="text-gray-400">{challenge.discussion.description}</p>
          {challengeStatus === "challenger" ? (
            <div className="mt-[2rem] flex gap-2">
              <Button
                variant="primary"
                className="w-[8rem]"
                onClick={() => handleChallegeAcceptance(challenge)}
                disabled={challenge.accepted}
              >
                {challenge.accepted ? "Accepted" : "Accept"}
              </Button>
              {challenge.accepted && (
                <Button
                  variant="secondary"
                  className="w-[12rem] gap-2"
                  onClick={() => {
                    router.push(`/challenges/${challenge.$id}`);
                  }}
                >
                  <ExternalLink size="1rem" />
                  Challenge thread
                </Button>
              )}
            </div>
          ) : (
            challenge.accepted && (
              <div className="flex flex-col gap-4">
                <p className="font-semibold">
                  Your challenge has been accepted
                </p>
                <Button
                  variant="secondary"
                  className="w-[12rem] gap-2"
                  onClick={() => {
                    router.push(`/challenges/${challenge.$id}`);
                  }}
                >
                  <ExternalLink size="1rem" />
                  Challenge thread
                </Button>
              </div>
            )
          )}
        </DivWrapper>
      ))}
    </div>
  );
}

function Challenges() {
  return (
    <UIWrapper>
      <div className="mb-10 flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1
              className={`${sora.className} bg-gradient-to-r  from-accent to-white
          bg-clip-text text-3xl font-bold leading-[1.25]
          text-transparent
          `}
            >
              Discussions: You have Challenged
            </h1>
            <p className="text-gray-400">
              These are all discussions that you have challenged so far
            </p>
          </div>
          <ListChallenges challengeStatus="challenged" />
        </div>
        <SelectSeparator className="bg-btn_secondary" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1
              className={`${sora.className} bg-gradient-to-r  from-accent to-white
          bg-clip-text text-3xl font-bold leading-[1.25]
          text-transparent
          `}
            >
              Discussions: You are being Challenged For
            </h1>
            <p className="text-gray-400">
              These are all the your discussions that have been challenged so
              far.
            </p>
          </div>
          <ListChallenges challengeStatus="challenger" />
        </div>
      </div>
    </UIWrapper>
  );
}

export default () => <WithAuth WrappedComponent={Challenges} />;
