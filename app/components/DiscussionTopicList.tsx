"use client";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collection from "utils/appwriteCollections";
import { Models, Query } from "appwrite";
import { useStore } from "store";
import { HTMLAttributes, useContext, useEffect, useState } from "react";
import DiscussionTopicCard from "./DiscussionTopicCard";
import { RefetchContext } from "context/RefetchContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";

export default function DiscussionTopicList({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const user = useStore((state) => state.user);
  const [discussionTopicList, setDiscussionTopicList] = useState<
    Models.Document[]
  >([]);
  const { refetch, setRefetch } = useContext(RefetchContext);
  const [parent, enableAnimations] = useAutoAnimate();

  async function getDiscussionTopicList() {
    // waits for the user info to load
    try {
      const { documents } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collection["Discussion Topics"],
        [Query.equal("author", [user.userId])]
      );
      enableAnimations(true);
      return Promise.resolve(documents);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  useEffect(() => {
    getDiscussionTopicList().then((documents) => {
      setDiscussionTopicList(documents);
      if (refetch) setRefetch(false);
    });
  }, [user, refetch]);

  return (
    <div
      className={clsx("flex flex-col gap-5", className)}
      ref={parent}
      {...props}
    >
      {discussionTopicList.map((discussionTopic, i) => (
        <span key={i}>
          <DiscussionTopicCard
            discussionTopic={discussionTopic}
            disabled={!discussionTopic.active}
          />
        </span>
      ))}
      {discussionTopicList.length === 0 && <p>No Discussions yet!</p>}
    </div>
  );
}
