"use client";
import React, { useEffect, useState } from "react";
import WithAuth from "app/components/WithAuth";
import { useStore } from "store";
import Sidebar from "app/components/Sidebar";
import { inter } from "app/fonts";
import { RefetchContext } from "context/RefetchContext";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import { Models, Query } from "appwrite";
import Collections from "utils/appwriteCollections";
import { Button } from "app/components/ui/button";
import { ExternalLink, Search, User2, Users } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input } from "app/components/ui/input";
import { SelectSeparator } from "app/components/ui/select";

function ListCommunities() {
  const [communities, setCommunities] = useState<Models.Document[]>([]);
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
            if (community.$id === _community.communities.$id) {
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
          communities: community.$id,
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
            className="flex flex-col gap-2 rounded-lg border border-btn_secondary bg-secondary pb-5 pl-7 pr-7 pt-5 transition-all duration-300 hover:brightness-110"
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
                disabled={joined.has(community.$id)}
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
  const [refetch, setRefetch] = useState<boolean>(false);

  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      <div className="h-[100svh] bg-secondary">
        <Sidebar />
        <div className="fixed top-[0] z-[100] ml-[18%] mt-[0.85em] h-[97svh] w-[81%] overflow-y-auto rounded-xl border border-btn_secondary bg-background pl-[4%] pr-[4%] pt-[2%] shadow-xl shadow-background">
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
                placeholder="Find your community"
                className="h-full border border-btn_secondary bg-secondary hover:brightness-[130%] focus:border focus:border-primary focus:brightness-[130%]"
              />
              <Button variant="primary" className="h-full gap-2" size="lg">
                <Search size="1rem" />
                Search
              </Button>
            </div>
            <SelectSeparator className="mt-10 bg-btn_secondary" />
            <ListCommunities />
          </div>
        </div>
      </div>
    </RefetchContext.Provider>
  );
}

export default () => <WithAuth WrappedComponent={Community} />;
