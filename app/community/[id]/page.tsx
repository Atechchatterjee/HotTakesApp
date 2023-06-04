"use client";
import WithAuth from "app/components/WithAuth";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { Models } from "node-appwrite";
import DiscussionTopicCard from "app/components/DiscussionTopicCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { inter } from "app/fonts";
import Sidebar from "app/components/Sidebar";

interface CommunityPageProps {
  params: { id: string };
}

function CommunityPage({ params: { id } }: CommunityPageProps) {
  const [relatedDiscussions, setRelatedDiscussions] = useState<
    Models.Document[]
  >([]);

  async function fetchRelatedDiscussionTopics() {
    try {
      const { documents: _relatedDiscussions } =
        await appwriteDatabase.listDocuments(
          hottakesDatabaseId,
          Collections["Discussion Topics"],
          [Query.equal("community", [id])]
        );
      setRelatedDiscussions(_relatedDiscussions);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchRelatedDiscussionTopics().then(() => enableAnimations(true));
  }, []);

  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <div className="h-[100svh] bg-secondary">
      <Sidebar />
      <div className="fixed top-[0] z-[100] ml-[20%] mt-[0.85em] h-[97svh] w-[79.5%] overflow-y-auto rounded-3xl bg-background pl-[4%] pr-[4%] pt-[2%]">
        <h1
          className={`${inter.className} mb-5 bg-gradient-to-r from-accent to-white bg-clip-text text-4xl font-bold leading-[1.25] text-transparent`}
        >
          Discussion Topics
        </h1>
        <div className="flex flex-col gap-5" ref={parent}>
          {relatedDiscussions.map((discussionTopic, i) => (
            <span key={i}>
              <DiscussionTopicCard
                discussionTopic={discussionTopic}
                // disabled={!discussionTopic.active}
              />
            </span>
          ))}
          {relatedDiscussions.length === 0 && <p>No Discussions yet!</p>}
        </div>
      </div>
    </div>
  );
}

export default ({ params: { id } }: CommunityPageProps) => (
  <WithAuth WrappedComponent={CommunityPage} {...{ params: { id } }} />
);
