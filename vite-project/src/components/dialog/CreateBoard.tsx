import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import usePostQuery from "@/hooks/usePostQuery";
import { toast } from "../ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const CreateBoard: React.FC = () => {
  const { mutate, isPending } = usePostQuery("/api/boards/createNewBoard");
  const queryClient = useQueryClient();
  const [boardName, setBoardName] = useState("");
  const { isOpen, setClose } = useModal();

  const handleCreateBoard = () => {
    mutate(
      {
        name: boardName,
      },
      {
        onSuccess: () => {
          toast({
            title: "Board Created Successfully.",
            description: "You can now access your board from dashboard.",
          });
          queryClient.invalidateQueries({
            queryKey: ["boardList"],
          });
          setClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Enter the name for your new board.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Board Name
            </Label>
            <Input
              id="name"
              placeholder="Enter board name"
              className="col-span-3"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button size={"sm"} type="submit" onClick={handleCreateBoard}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Create Board"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoard;
