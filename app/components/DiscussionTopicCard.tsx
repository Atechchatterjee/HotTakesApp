"use client";
import { Models, Query } from "appwrite";
import { Button } from "app/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { useStore } from "store";
import { Pause, Play } from "lucide-react";
import clsx from "clsx";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collection from "utils/appwriteCollections";
import { useContext, useEffect, useState } from "react";
import { RefetchContext } from "context/RefetchContext";
import DivWrapper from "./DivWrapper";

export default function DiscussionTopicCard({
  discussionTopic,
  disabled = false,
}: {
  discussionTopic: Models.Document;
  disabled?: boolean;
}) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const { setRefetch } = useContext(RefetchContext);
  const [participating, setParticipating] = useState<boolean>(false);

  async function setDiscussionStatus(discussionState: boolean) {
    try {
      await appwriteDatabase.updateDocument(
        hottakesDatabaseId,
        Collection["Discussion Topics"],
        discussionTopic.$id,
        { active: discussionState }
      );
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  }

  async function stopDiscussion() {
    await setDiscussionStatus(false);
    setRefetch(true);
  }

  async function resumeDiscussion() {
    await setDiscussionStatus(true);
    setRefetch(true);
  }

  async function checkIfAlreadyParticipating(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { documents } = await appwriteDatabase.listDocuments(
          hottakesDatabaseId,
          Collection["Participation"],
          [
            Query.equal("discussionTopics", [discussionTopic.$id]),
            Query.equal("userId", [user.userId]),
          ]
        );
        if (documents.length === 0) {
          setParticipating(false);
          reject();
        } else {
          setParticipating(true);
          resolve();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  async function incrementNoOfParticipants() {
    try {
      await appwriteDatabase.updateDocument(
        hottakesDatabaseId,
        Collection["Discussion Topics"],
        discussionTopic.$id,
        {
          participants: discussionTopic.participants + 1,
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function addParticipation(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        incrementNoOfParticipants();
        await appwriteDatabase.createDocument(
          hottakesDatabaseId,
          Collection["Participation"],
          "",
          {
            userId: user.userId,
            discussionTopics: discussionTopic.$id,
          }
        );
        setParticipating(true);
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  function handleParticipation() {
    checkIfAlreadyParticipating().catch(() => addParticipation());
  }

  useEffect(() => {
    checkIfAlreadyParticipating();
  }, []);

  return (
    <DivWrapper
      className="pb-[1em] pl-[2em] pr-[2em] pt-[1em]"
      highlight={disabled}
    >
      <h2 className="text-[1.3rem] font-bold">{discussionTopic.topic}</h2>
      <Badge
        className={clsx(
          "w-[4rem] justify-center bg-btn_secondary",
          disabled && "brightness-[75%]"
        )}
      >
        {discussionTopic.type}
      </Badge>
      {discussionTopic.description && (
        <p className="text-gray-400">{discussionTopic.description}</p>
      )}
      <div className="flex gap-5">
        {user.isAuthor &&
          (discussionTopic.active ? (
            <Button
              variant="primary"
              className="mt-[2rem] w-[12rem] gap-3"
              onClick={() => {
                stopDiscussion();
              }}
            >
              <Pause size="1rem" />
              Stop Discussion
            </Button>
          ) : (
            <Button
              variant="primary"
              className="mt-[2rem] w-[12rem] gap-3"
              onClick={() => {
                resumeDiscussion();
              }}
            >
              <Play size="1rem" />
              Resume Discussion
            </Button>
          ))}
        {!participating ? (
          <Button
            variant="secondary"
            className="mt-[2rem] w-[8rem]"
            onClick={() => {
              handleParticipation();
            }}
            disabled={disabled}
          >
            Participate
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="mt-[2rem] w-[10rem]"
            onClick={() => {
              router.push(`/discussions/${discussionTopic.$id}`);
            }}
            disabled={disabled}
          >
            Dicussion Thread
          </Button>
        )}
      </div>
    </DivWrapper>
  );
}
