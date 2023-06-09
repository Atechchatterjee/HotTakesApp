import { Models } from "appwrite";
import { Button } from "app/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { useStore } from "store";
import { Pause, Play } from "lucide-react";
import clsx from "clsx";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collection from "utils/appwriteCollections";
import { useContext } from "react";
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

  async function setDiscussionState(discussionState: boolean) {
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
    await setDiscussionState(false);
    setRefetch(true);
  }

  async function resumeDiscussion() {
    await setDiscussionState(true);
    setRefetch(true);
  }

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
        <Button
          variant="secondary"
          className="mt-[2rem] w-[8rem]"
          onClick={() => {
            router.push(`/discussions/${discussionTopic.$id}`);
          }}
          disabled={disabled}
        >
          Participate
        </Button>
      </div>
    </DivWrapper>
  );
}
