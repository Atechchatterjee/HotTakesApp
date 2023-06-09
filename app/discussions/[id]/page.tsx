"use client";
import { Button } from "app/components/ui/button";
import { Models, Query } from "appwrite";
import { PauseCircle, Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collection from "utils/appwriteCollections";
import { sora } from "app/fonts";
import WithAuth from "app/components/WithAuth";
import UIWrapper from "app/components/UIWrapper";
import { Textarea } from "app/components/ui/textarea";
import Collections from "utils/appwriteCollections";
import { useToast } from "app/components/ui/use-toast";
import { useStore } from "store";
import { SelectSeparator } from "app/components/ui/select";
import { trpc } from "utils/trpc";
import clsx from "clsx";
import DivWrapper from "app/components/DivWrapper";
import { RefetchContext } from "context/RefetchContext";

interface DiscussionsProps {
  params: { id: string };
}

function DisplayUser({
  className,
  userId,
  ...props
}: { userId: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  let { data } = trpc.getUsers.useQuery({ userId: userId });

  return (
    <p className={clsx("text-lg font-semibold", className)} {...props}>
      {data?.user?.name}
    </p>
  );
}

function ListDiscussions({ id }: { id: string }) {
  const [discussions, setDiscussions] = useState<Models.Document[]>([]);
  const user = useStore((state) => state.user);
  const { refetch, setRefetch } = useContext(RefetchContext);

  async function searchDiscussions() {
    try {
      const { documents: discussions } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collection["Discussion"],
        [Query.equal("discussionTopics", [id])]
      );
      setDiscussions(discussions);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    searchDiscussions().then(() => setRefetch(false));
  }, [refetch]);

  return (
    <div className="mt-10 flex flex-col gap-5 pb-10">
      <SelectSeparator className="bg-btn_secondary" />
      <p className="text-[0.9rem] font-medium text-gray-400">DISCUSSIONS</p>
      {discussions.map((discussion, i) => (
        <DivWrapper highlight={user.userId === discussion.user} key={i}>
          {user.userId === discussion.user ? (
            <p className="text-lg font-semibold">YOU</p>
          ) : (
            <DisplayUser userId={discussion.user} />
          )}
          <p className="text-gray-400">{discussion.description}</p>
          {user.userId !== discussion.user && (
            <Button variant="primary" className="mt-[2rem] w-[8rem]">
              Challenge
            </Button>
          )}
        </DivWrapper>
      ))}
    </div>
  );
}

function Discussions({ params: { id } }: DiscussionsProps) {
  const [currentDiscussionTopic, setCurrentDiscussionTopic] =
    useState<Models.Document>();
  const [newDiscussionDescription, setNewDiscussionDescription] =
    useState<string>("");
  const [refetch, setRefetch] = useState<boolean>(false);

  const { toast } = useToast();
  const user = useStore((state) => state.user);

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

  async function createDiscussions() {
    try {
      await appwriteDatabase.createDocument(
        hottakesDatabaseId,
        Collections["Discussion"],
        "",
        {
          user: user.userId,
          description: newDiscussionDescription,
          discussionTopics: currentDiscussionTopic?.$id,
        }
      );
      toast({
        title: "Congrats!! You gave your hot take on this topic",
        variant: "success",
      });
      setRefetch(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "OOPS!! Could not take your hot takes :( Please try again",
        variant: "error",
      });
    }
  }

  useEffect(() => {
    fetchCurrentDiscussionTopic();
  }, []);

  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      <UIWrapper>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-400">
            Discussion #{id}
          </p>
          <h1
            className={`${sora.className} bg-gradient-to-r  from-accent to-white
          bg-clip-text text-3xl font-bold leading-[1.25]
          text-transparent
          `}
          >
            {currentDiscussionTopic?.topic}
          </h1>
          <p className="text-gray-400">{currentDiscussionTopic?.description}</p>
        </div>
        {currentDiscussionTopic?.active ? (
          <>
            <div className="mt-5 flex flex-col gap-5">
              <Textarea
                placeholder="Give Your Hot Take..."
                className="h-[10rem]"
                value={newDiscussionDescription}
                onChange={(e: any) =>
                  setNewDiscussionDescription(e.target.value)
                }
              />
              <Button
                variant="primary"
                size="lg"
                className="w-[13rem] gap-2 self-start"
                onClick={() => {
                  createDiscussions();
                  setNewDiscussionDescription("");
                }}
              >
                <Plus size="1.1rem" />
                New Discussion
              </Button>
            </div>
            <SelectSeparator />
            <ListDiscussions id={id} />
          </>
        ) : (
          currentDiscussionTopic && (
            <div className="mt-10 flex gap-2 rounded-lg bg-btn_secondary p-5">
              <PauseCircle
                className="self-center text-rose-500"
                size="1.2rem"
              />
              <p className=" self-center text-lg font-semibold text-rose-500">
                Discussion Paused:
              </p>
              <p className="text-md self-center text-gray-400">
                This Discussion has been temporarily paused by the author.
              </p>
            </div>
          )
        )}
      </UIWrapper>
    </RefetchContext.Provider>
  );
}

export default ({ params: { id } }: DiscussionsProps) => (
  <WithAuth WrappedComponent={Discussions} {...{ params: { id } }} />
);
