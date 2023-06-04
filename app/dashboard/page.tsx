"use client";
import React, { useEffect, useState } from "react";
import WithAuth from "app/components/WithAuth";
import { useStore } from "store";
import Sidebar from "app/components/Sidebar";
import DiscussionTopicList from "app/components/DiscussionTopicList";
import { inter, sora } from "app/fonts";
import { RefetchContext } from "context/RefetchContext";
import NewDiscussionSection from "app/components/NewDiscussionSection";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import { Models, Query } from "appwrite";
import Collections from "utils/appwriteCollections";
import { Button } from "app/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { SelectSeparator } from "app/components/ui/select";

function ListDiscussions() {
  const user = useStore((state) => state.user);

  return (
    <div className="relative">
      <h1
        className={`${sora.className} bg-gradient-to-r  from-accent to-white
        bg-clip-text text-3xl font-bold leading-[1.25]
        text-transparent
        `}
      >
        Discussions
      </h1>
      {user.isAuthor && <NewDiscussionSection className="sticky mt-3" />}
      <DiscussionTopicList className="mt-7" />
    </div>
  );
}

function CommunitiesJoined() {
  const [communitiesJoined, setCommunitiesJoined] = useState<Models.Document[]>(
    []
  );
  const userId = useStore((state) => state.user.userId);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { documents: communitiesJoined } =
          await appwriteDatabase.listDocuments(
            hottakesDatabaseId,
            Collections["Community Relations"],
            [Query.equal("userId", [userId])]
          );
        setCommunitiesJoined(communitiesJoined);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userId]);

  return (
    <div className="mb-10 flex flex-col gap-5">
      <h1
        className={`${inter.className} bg-gradient-to-r from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
      >
        Joined Communities
      </h1>
      {communitiesJoined.length === 0 && (
        <p className=" text-gray-400">No communities Joined yet</p>
      )}
      <div className="mt-5">
        {communitiesJoined.map((community, i) => {
          return (
            <div
              className="flex flex-col gap-2 rounded-lg border border-btn_secondary bg-secondary pb-5 pl-7 pr-7 pt-5 transition-all duration-300 hover:brightness-110"
              key={i}
            >
              <h2 className={`${inter.className} text-2xl font-bold`}>
                {community.communities.name}
              </h2>
              <p className="text-[1.1rem] font-medium">
                {community.communities.authorName}
                <span className="font-bold text-accent"> @author</span>
              </p>
              <p className="text-gray-400">
                {community.communities.description}
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-[8rem] flex-1 gap-2"
                onClick={() => {
                  router.push(`community/${community.communities.$id}`);
                }}
              >
                <ExternalLink size="1rem" />
                Details
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Dashboard() {
  const user = useStore((state) => state.user);
  const [refetch, setRefetch] = useState<boolean>(false);

  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      <div className="h-[100svh] bg-secondary">
        <Sidebar />
        <div className="fixed top-[0] z-[100] ml-[18%] mt-[0.85em] h-[97svh] w-[81%] overflow-y-auto rounded-xl border border-btn_secondary bg-background pl-[4%] pr-[4%] pt-[2%] shadow-xl shadow-background">
          <div className="flex flex-col gap-3">
            {user.isAuthor && <ListDiscussions />}
            <SelectSeparator className="mb-5 mt-10 bg-btn_secondary" />
            <CommunitiesJoined />
          </div>
        </div>
      </div>
    </RefetchContext.Provider>
  );
}

export default () => <WithAuth WrappedComponent={Dashboard} />;
