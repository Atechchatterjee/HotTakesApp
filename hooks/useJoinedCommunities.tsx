import { Models, Query } from "appwrite";
import { useState, useEffect } from "react";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import { useStore } from "store";

export function useJoinedCommunities() {
  const [communitiesJoined, setCommunitiesJoined] = useState<Models.Document[]>(
    []
  );
  const userId = useStore((state) => state.user.userId);

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

  return { communitiesJoined, setCommunitiesJoined };
}
