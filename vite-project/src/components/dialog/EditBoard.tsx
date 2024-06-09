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

type EditBoardProps = {
  id: string;
  name: string;
};

const EditBoard: React.FC<EditBoardProps> = ({ id, name }) => {
  const [boardName, setBoardName] = useState(name);
  const { isOpen, setClose } = useModal();
  const handleClose = () => setClose();

  const handleEditBoard = () => {
    console.log(id, boardName);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
          <DialogDescription>Edit the name for your board.</DialogDescription>
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
          <Button size={"sm"} type="submit" onClick={handleEditBoard}>
            Edit Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBoard;
