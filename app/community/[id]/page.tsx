"use client";
import WithAuth from "app/components/WithAuth";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import { Query, type Models } from "appwrite";
import { useState } from "react";
import DiscussionTopicCard from "app/components/DiscussionTopicCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { inter } from "app/fonts";
import UIWrapper from "app/components/UIWrapper";
import { useQuery } from "@tanstack/react-query";

interface CommunityPageProps {
  params: { id: string };
}

function CommunityPage({ params: { id } }: CommunityPageProps) {
  const [relatedDiscussions, setRelatedDiscussions] = useState<
    Models.Document[]
  >([]);
  const [parent, enableAnimations] = useAutoAnimate();

  useQuery({
    queryFn: async function fetchRelatedDiscussions() {
      const { documents: _relatedDiscussions } =
        await appwriteDatabase.listDocuments(
          hottakesDatabaseId,
          Collections["Discussion Topics"],
          [Query.equal("community", [id])]
        );
      setRelatedDiscussions(_relatedDiscussions);
      enableAnimations(true);
    },
  });

  return (
    <UIWrapper>
      <h1
        className={`${inter.className} mb-5 bg-gradient-to-r from-accent to-white bg-clip-text text-4xl font-bold leading-[1.25] text-transparent`}
      >
        Discussion Topics
      </h1>
      <div className="flex flex-col gap-5" ref={parent}>
        {relatedDiscussions.map((discussionTopic, i) => (
          <span key={i}>
            <DiscussionTopicCard discussionTopic={discussionTopic} />
          </span>
        ))}
        {relatedDiscussions.length === 0 && <p>No Discussions yet!</p>}
      </div>
    </UIWrapper>
  );
}

export default ({ params: { id } }: CommunityPageProps) => (
  <WithAuth WrappedComponent={CommunityPage} {...{ params: { id } }} />
);
