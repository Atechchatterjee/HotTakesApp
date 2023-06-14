"use client";
import WithAuth from "app/components/WithAuth";
import UIWrapper from "app/components/UIWrapper";
import { inter } from "app/fonts";
import DiscussionTopicList from "app/components/DiscussionTopicList";
import { useQuery } from "@tanstack/react-query";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import DivWrapper from "app/components/DivWrapper";
import clsx from "clsx";
import { Button } from "app/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

function Feed() {
  const { data: allChallenges } = useQuery({
    queryFn: async function fetchAllChallenges() {
      const { documents: allChallenges } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Challenges"]
      );
      return allChallenges;
    },
  });

  const router = useRouter();

  return (
    <UIWrapper className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h1
          className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
        >
          Trendy Discussion Topics
        </h1>
        <p className="text-gray-400">
          These are the trendiest discussions among various communities
        </p>
      </div>
      <DiscussionTopicList className="mb-10 mt-10" allDiscussions />
      <div className="gap-=2 flex flex-col">
        <h1
          className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
        >
          Trendy Challenges
        </h1>
        <p className="text-gray-400">
          These are the trendiest topics people are challenging on.
        </p>
      </div>
      <div className="mb-10 mt-10 flex flex-col gap-5">
        {allChallenges?.map((challenge, i) => (
          <DivWrapper
            key={i}
            className={clsx(challenge.accepted && "border-primary", "gap-3")}
          >
            <h2 className="text-[1.3rem] font-semibold">
              {challenge.discussion.discussionTopics.topic}
            </h2>
            <p className="text-gray-400">
              {challenge.discussion.discussionTopics.description}
            </p>
            <div className="flex flex-col gap-2 text-gray-400">
              <p className="font-semibold text-white">Challenger's Take</p>
              <p className="text-gray-400">
                {challenge.discussion.description}
              </p>
            </div>
            {challenge.accepted && (
              <Button
                variant="secondary"
                className="mt-2 w-[12rem] gap-2"
                onClick={() => {
                  router.push(`/challenges/${challenge.$id}`);
                }}
              >
                <ExternalLink size="1rem" />
                Challenge thread
              </Button>
            )}
          </DivWrapper>
        ))}
      </div>
    </UIWrapper>
  );
}

export default () => <WithAuth WrappedComponent={Feed} />;
