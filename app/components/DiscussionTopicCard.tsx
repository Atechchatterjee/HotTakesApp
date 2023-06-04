import { Models } from "appwrite";
import { Button } from "app/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { useStore } from "store";
import { Pause, Play, X } from "lucide-react";
import clsx from "clsx";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collection from "utils/appwriteCollections";
import { useContext } from "react";
import { RefetchContext } from "context/RefetchContext";

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
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-lg border border-btn_secondary transition-all duration-300 hover:brightness-110",
        disabled ? "bg-disabled" : "bg-secondary",
        "pb-[1em] pl-[2em] pr-[2em] pt-[1em]"
      )}
    >
      <h2 className="text-[1.3rem] font-bold">{discussionTopic.topic}</h2>
      <Badge className="w-[4rem] justify-center bg-btn_secondary">
        {discussionTopic.type}
      </Badge>
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
        >
          Participate
        </Button>
      </div>
    </div>
  );
}
