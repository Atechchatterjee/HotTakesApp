"use client";
import React, { useState } from "react";
import WithAuth from "app/components/WithAuth";
import { useStore } from "store";
import DiscussionTopicList from "app/components/DiscussionTopicList";
import { inter } from "app/fonts";
import { RefetchContext } from "context/RefetchContext";
import NewDiscussionSection from "app/components/NewDiscussionSection";
import { Button } from "app/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { SelectSeparator } from "app/components/ui/select";
import UIWrapper from "app/components/UIWrapper";
import { useJoinedCommunities } from "hooks/useJoinedCommunities";
import DivWrapper from "app/components/DivWrapper";

function ListDiscussions() {
  const user = useStore((state) => state.user);

  return (
    <div className="relative">
      {user.isAuthor && (
        <>
          <h1
            className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
          >
            Create Discussions
          </h1>
          <p className="mt-1 text-gray-400">
            "Create Discussions - Where Hot Takes Take Center Stage!"
          </p>
          <NewDiscussionSection className="sticky mt-10" />
          <SelectSeparator className="mt-5 bg-btn_secondary" />
        </>
      )}
      <div className="mt-7 flex flex-col gap-2">
        <h1
          className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
        >
          List of Discussions
        </h1>
        <p className="text-gray-400">
          These are all the discussion you have authored in your community
        </p>
        <DiscussionTopicList className="mt-10" />
      </div>
    </div>
  );
}

function CommunitiesJoined() {
  const { communitiesJoined } = useJoinedCommunities();
  const router = useRouter();

  return (
    <div className="mb-10 flex flex-col gap-2">
      <h1
        className={`${inter.className} bg-gradient-to-r from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
      >
        Joined Communities
      </h1>
      <p className="text-gray-400">
        These are all the communities you are a part of
      </p>
      {communitiesJoined.length === 0 && (
        <p className=" text-gray-400">No communities Joined yet</p>
      )}
      <div className="mt-10 flex flex-col gap-5">
        {communitiesJoined.map((community, i) => {
          return (
            <DivWrapper key={i}>
              <h2 className={`${inter.className} text-2xl font-bold`}>
                {community.communities[0].name}
              </h2>
              <p className="text-[1.1rem] font-medium">
                {community.communities[0].authorName}
                <span className="font-bold text-accent"> @author</span>
              </p>
              <p className="text-gray-400">
                {community.communities[0].description}
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-[14rem] flex-1 gap-3"
                onClick={() => {
                  router.push(`community/${community.communities[0].$id}`);
                }}
              >
                <ExternalLink size="1rem" />
                Community Page
              </Button>
            </DivWrapper>
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
      <UIWrapper>
        <div className="flex flex-col gap-3">
          {user.isAuthor && (
            <>
              <ListDiscussions />
              <SelectSeparator className="mb-5 mt-10 bg-btn_secondary" />
            </>
          )}
          <CommunitiesJoined />
        </div>
      </UIWrapper>
    </RefetchContext.Provider>
  );
}

export default () => <WithAuth WrappedComponent={Dashboard} />;
