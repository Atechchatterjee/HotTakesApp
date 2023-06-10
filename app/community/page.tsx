"use client";
import React, { useState } from "react";
import WithAuth from "app/components/WithAuth";
import { inter } from "app/fonts";
import { RefetchContext } from "context/RefetchContext";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import { Models, Query } from "appwrite";
import Collections from "utils/appwriteCollections";
import { Button } from "app/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "app/components/ui/input";
import { SelectSeparator } from "app/components/ui/select";
import UIWrapper from "app/components/UIWrapper";
import ListCommunities from "./ListCommunities";

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
              onKeyDownCapture={(e) => {
                if (e.code === "Enter") {
                  searchCommunityByTopic();
                }
              }}
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
