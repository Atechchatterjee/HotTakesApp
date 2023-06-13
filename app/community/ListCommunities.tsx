"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "store";
import { inter } from "app/fonts";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import { Models, Query } from "appwrite";
import Collections from "utils/appwriteCollections";
import { Button } from "app/components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface ListCommunitiesProps {
  communities: Models.Document[];
  setCommunities: React.Dispatch<React.SetStateAction<Models.Document[]>>;
}

export default function ListCommunities({
  communities,
  setCommunities,
}: ListCommunitiesProps) {
  const [parent, enableAnimations] = useAutoAnimate();
  const [joinedCommunitySet, setJoinedCommunitySet] = useState<Set<string>>(
    new Set()
  );
  const [communityToJoin, setCommunityToJoin] = useState<Models.Document>();

  const { userId } = useStore((state) => state.user);

  const router = useRouter();

  useQuery({
    queryFn: async function fetchCommunities() {
      const { documents } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Communities"]
      );
      setCommunities(documents);
      return documents;
    },
  });

  useQuery({
    queryKey: [userId, communities],
    queryFn: async function fetchJoinedDiscussions() {
      const { documents: _communities } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Community Relations"],
        [Query.equal("userId", [userId])]
      );

      const newJoined = new Set<string>();

      // checks which communities the current user has joined
      communities.forEach((community) => {
        _communities.forEach((_community) => {
          if (community.$id === _community.communities[0].$id) {
            newJoined.add(community.$id);
          }
        });
      });

      setJoinedCommunitySet(newJoined);
      return _communities;
    },
  });

  const { refetch: joinCommunity } = useQuery({
    enabled: !!communityToJoin,
    queryKey: ["communityToJoin", communityToJoin],
    queryFn: async function joinCommunity() {
      const promise = await appwriteDatabase.createDocument(
        hottakesDatabaseId,
        Collections["Community Relations"],
        "",
        {
          userId,
          communities: [communityToJoin?.$id],
        }
      );
      setJoinedCommunitySet(
        (prevState) => new Set([...prevState, communityToJoin?.$id || ""])
      );
      return promise;
    },
  });

  useEffect(() => {
    enableAnimations(true);
  }, []);

  return (
    <div className="mt-5 flex flex-col gap-4" ref={parent}>
      <p className="text-sm font-medium text-gray-400">LIST OF COMMUNITIES</p>
      {communities.map((community, i) => {
        return (
          <div
            className="flex flex-col gap-2 rounded-lg border border-btn_secondary bg-secondary pb-5 pl-7 pr-7 pt-5 transition-all duration-300 hover:brightness-[130%]"
            key={i}
          >
            <h2 className={`${inter.className} text-2xl font-bold`}>
              {community.name}
            </h2>
            <p className="text-[1.1rem] font-medium">
              {community.authorName}
              <span className="font-bold text-accent"> @author</span>
            </p>
            <p className="text-gray-400">{community.description}</p>
            <div className="mt-7 flex w-[18rem] gap-3">
              <Button
                variant="primary"
                className={"flex-1 gap-2"}
                disabled={
                  joinedCommunitySet.has(community.$id) ||
                  userId === community.author
                }
                onClick={() => {
                  setCommunityToJoin(community);
                  joinCommunity();
                }}
              >
                <Users size="0.9rem" />
                {joinedCommunitySet.has(community.$id) ? "Joined" : "Join"}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => {
                  router.push(`/community/${community.$id}`);
                }}
              >
                <ExternalLink size="1rem" />
                Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
