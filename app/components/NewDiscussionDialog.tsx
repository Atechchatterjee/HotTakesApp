import { Button } from "app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "app/components/ui/dialog";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useContext, useState } from "react";
import { appwriteDatabase, hottakesDatabaseId } from "utils/appwriteConfig";
import Collections from "utils/appwriteCollections";
import { useStore } from "store";
import getTeams from "utils/getTeams";
import { Plus } from "lucide-react";
import { RefetchContext } from "context/RefetchContext";

type DiscussionType = "normal" | "debate";

export default function NewDiscussionDialog() {
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
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="primary" size="lg" className="w-[11rem] gap-2">
          <Plus size="1.1rem" />
          New Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-accent bg-secondary sm:max-w-[425px]">
        <DialogHeader className="gap-3">
          <DialogTitle>Create a Discussion Topic</DialogTitle>
          <DialogDescription>
            Create a topic for your discussion and mention its type. Click
            create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Topic
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Type
            </Label>
            <Select
              onValueChange={(type: DiscussionType) => setDiscussionType(type)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="debate">Debate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="primary"
            size="lg"
            onClick={createNewDiscussion}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
