import { Input } from "app/components/ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { HTMLAttributes, useContext, useState } from "react";
import { useStore } from "store";
import getTeams from "utils/getTeams";
import { RefetchContext } from "context/RefetchContext";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "app/components/ui/select";
import clsx from "clsx";

type DiscussionType = "normal" | "debate";

export default function NewDiscussionSection({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const [topic, setTopic] = useState<string>("");
  const [discussionType, setDiscussionType] =
    useState<DiscussionType>("normal");
  const { userId, isAuthor } = useStore((state) => ({
    userId: state.user.userId,
    isAuthor: state.user.isAuthor,
  }));

  const { setRefetch } = useContext(RefetchContext);

  async function createNewDiscussion() {
    try {
      const teams = await getTeams();
      // if the user(author) is member of a team other than the "Authors"
      // then that would be the "community" of the author.
      const community = teams.filter((team) => team.name !== "Authors");

      if (!isAuthor)
        // This should never happen but double checking just incase
        alert("Only Authors are allowed to create discussion topics!!");
      else {
        await appwriteDatabase.createDocument(
          hottakesDatabaseId,
          Collections["Discussion Topics"],
          "",
          {
            topic,
            type: discussionType,
            author: isAuthor ? userId : "",
            community: community[0]?.$id,
          }
        );
      }
      setRefetch(true);
      setDiscussionType("normal");
      setTopic("");
      // setOpen(false);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className={clsx("flex gap-5", className)}>
      <Input
        placeholder="Create New Discussion Topic"
        className="h-11 border border-btn_secondary bg-secondary hover:brightness-[130%] focus:border focus:border-primary focus:brightness-[130%]"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <Select onValueChange={(type: DiscussionType) => setDiscussionType(type)}>
        <SelectTrigger className="h-11 w-[180px] border border-btn_secondary bg-secondary hover:brightness-[130%] focus:brightness-[130%]">
          <SelectValue placeholder="normal" />
        </SelectTrigger>
        <SelectContent className="z-[100]">
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="debate">Debate</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="primary"
        size="lg"
        className="w-[14rem] gap-2"
        onClick={createNewDiscussion}
      >
        <Plus size="1.1rem" />
        New Topic
      </Button>
    </div>
  );
}
