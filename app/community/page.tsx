"use client";
import React, { useEffect, useState } from "react";
import WithAuth from "app/components/WithAuth";
import { useStore } from "store";
import { inter } from "app/fonts";
import { RefetchContext } from "context/RefetchContext";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import { Models, Query } from "appwrite";
import Collections from "utils/appwriteCollections";
import { Button } from "app/components/ui/button";
import { ExternalLink, Search, Users } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input } from "app/components/ui/input";
import { SelectSeparator } from "app/components/ui/select";
import UIWrapper from "app/components/UIWrapper";
import { join } from "path";

interface ListCommunitiesProps {
  communities: Models.Document[];
  setCommunities: React.Dispatch<React.SetStateAction<Models.Document[]>>;
}

function ListCommunities({
  communities,
  setCommunities,
}: ListCommunitiesProps) {
  const [parent, enableAnimations] = useAutoAnimate();
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const { userId } = useStore((state) => state.user);

  async function fetchCommunities() {
    try {
      const { documents } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Communities"]
      );
      setCommunities(documents);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { documents: _communities } =
          await appwriteDatabase.listDocuments(
            hottakesDatabaseId,
            Collections["Community Relations"],
            [Query.equal("userId", [userId])]
          );

        const newJoined = new Set<string>();

        communities.forEach((community) => {
          _communities.forEach((_community) => {
            if (community.$id === _community.communities[0].$id) {
              newJoined.add(community.$id);
            }
          });
        });
        setJoined(newJoined);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userId, communities]);

  async function joinCommunities(community: Models.Document) {
    try {
      await appwriteDatabase.createDocument(
        hottakesDatabaseId,
        Collections["Community Relations"],
        "",
        {
          userId,
          communities: [community.$id],
        }
      );
      setJoined((prevState) => new Set([...prevState, community.$id]));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCommunities();
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
                  joined.has(community.$id) || userId === community.author
                }
                onClick={() => {
                  joinCommunities(community);
                }}
              >
                <Users size="0.9rem" />
                {joined.has(community.$id) ? "Joined" : "Join"}
              </Button>
              <Button variant="secondary" className="flex-1 gap-2">
                <ExternalLink size="1rem" />
                Know More
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Community() {
  const [communities, setCommunities] = useState<Models.Document[]>([]);
  const [searchedCommunities, setSearchedCommunities] = useState<
    Models.Document[]
  >([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  async function searchCommunityByTopic() {
    console.log("searching for: ", search);
    try {
      const { documents: searchedDocuments } =
        await appwriteDatabase.listDocuments(
          hottakesDatabaseId,
          Collections["Communities"],
          [Query.search("name", search)]
        );
      setSearchedCommunities(searchedDocuments);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      <UIWrapper>
        <div className="mb-10 flex flex-col gap-2">
          <h1
            className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-4xl font-bold leading-[1.25] text-transparent`}
          >
            Choose Your Community
          </h1>
          <p className="text-gray-400">
            Pick a community of your liking and start participating
          </p>
          <div className="mt-5 flex h-[3rem] gap-2">
            <Input
              autoFocus
              placeholder="Find your community"
              className="h-full border border-btn_secondary bg-secondary hover:brightness-[130%] focus:border focus:border-primary focus:brightness-[130%]"
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <Button
              variant="primary"
              className="h-full gap-2"
              size="lg"
              onClick={searchCommunityByTopic}
            >
              <Search size="1rem" />
              Search
            </Button>
          </div>
          <SelectSeparator className="mt-10 bg-btn_secondary" />
          <ListCommunities
            communities={
              searchedCommunities.length > 0 ? searchedCommunities : communities
            }
            setCommunities={
              searchedCommunities.length > 0
                ? setSearchedCommunities
                : setCommunities
            }
          />
        </div>
      </UIWrapper>
    </RefetchContext.Provider>
  );
}

export default () => <WithAuth WrappedComponent={Community} />;
