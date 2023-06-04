"use client";
import { Button } from "app/components/ui/button";
import { Models } from "appwrite";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collection from "utils/appwriteCollections";
import { sora } from "app/fonts";
import Sidebar from "app/components/Sidebar";
import WithAuth from "app/components/WithAuth";

interface DiscussionsProps {
  params: { id: string };
}

function Discussions({ params: { id } }: DiscussionsProps) {
  const [currentDiscussionTopic, setCurrentDiscussionTopic] =
    useState<Models.Document>();

  async function fetchCurrentDiscussionTopic() {
    try {
      setCurrentDiscussionTopic(
        await appwriteDatabase.getDocument(
          hottakesDatabaseId,
          Collection["Discussion Topics"],
          id
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCurrentDiscussionTopic();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="flex w-[80%] flex-col gap-10 pl-[30%] pt-[2%]">
        <h1
          className={`${sora.className} bg-gradient-to-r  from-accent to-white
          bg-clip-text text-3xl font-bold leading-[1.25]
          text-transparent
          `}
        >
          {currentDiscussionTopic?.topic}
        </h1>
        <Button variant="primary" size="lg" className="w-[13rem] gap-2">
          <Plus size="1.1rem" />
          New Discussion
        </Button>
      </div>
    </>
  );
}

export default ({ params: { id } }: DiscussionsProps) => (
  <WithAuth WrappedComponent={Discussions} {...{ params: { id } }} />
);
