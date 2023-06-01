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

export default function NewDiscussionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-secondary sm:max-w-[425px]">
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
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Type
            </Label>
            <Select>
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
          <Button variant="primary" size="lg">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
