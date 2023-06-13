import { Input } from "app/components/ui/input";
import { Button } from "app/components/ui/button";
import { HTMLAttributes, useContext, useState } from "react";
import { useStore } from "store";
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
import { Textarea } from "./ui/textarea";
import { Query } from "appwrite";
import { useToast } from "./ui/use-toast";
import { MdCreate } from "react-icons/md";

type DiscussionType = "normal" | "debate";

export default function NewDiscussionSection({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const [topic, setTopic] = useState<string>("");
  const [discussionType, setDiscussionType] =
    useState<DiscussionType>("normal");
  const [description, setDescription] = useState<string>("");
  const { userId, isAuthor } = useStore((state) => ({
    userId: state.user.userId,
    isAuthor: state.user.isAuthor,
  }));
  const { toast } = useToast();

  const { setRefetch } = useContext(RefetchContext);

  async function createNewDiscussion() {
    try {
      // checks which community the author belongs to
      const { documents: community } = await appwriteDatabase.listDocuments(
        hottakesDatabaseId,
        Collections["Community Relations"],
        [Query.equal("userId", [userId])]
      );

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
            description,
            author: isAuthor ? userId : "",
            community: community[0]?.$id,
          }
        );
      }
      setRefetch(true);
      setDiscussionType("normal");
      setTopic("");
      setDescription("");
      toast({
        title: "Created Successfully",
        description: `Dicussion Topic '${topic}' has been created successfully`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to Create Discussion Topic",
        description: "Sorry for the inconvinience. Please try again.",
        variant: "error",
      });
    }
  }
  return (
    <div className="flex flex-col gap-5" {...props}>
      <div className={clsx("flex gap-5", className)}>
        <Input
          placeholder="Create New Discussion Topic"
          className="h-11 border border-btn_secondary bg-secondary hover:brightness-[130%] focus:border focus:border-primary focus:brightness-[130%]"
          autoFocus
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Select
          onValueChange={(type: DiscussionType) => setDiscussionType(type)}
        >
          <SelectTrigger className="h-11 w-[180px] border border-btn_secondary bg-secondary hover:brightness-[130%] focus:brightness-[130%]">
            <SelectValue placeholder="normal" />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="debate">Debate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={description}
        placeholder="Discussion Topic Description"
        className="h-[10rem]"
        onChange={(e: any) => setDescription(e.target.value)}
      />
      <Button
        variant="primary"
        size="lg"
        className="w-[10rem] gap-3 self-end"
        onClick={createNewDiscussion}
      >
        <MdCreate />
        Create
      </Button>
    </div>
  );
}
