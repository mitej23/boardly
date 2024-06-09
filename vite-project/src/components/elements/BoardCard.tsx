import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import EditBoard from "../dialog/EditBoard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeleteBoard from "../dialog/DeleteBoard";

type BoardCardProps = {
  id: string;
  name: string;
};

const BoardCard: React.FC<BoardCardProps> = ({ id, name }) => {
  const { setOpen } = useModal();

  const handleEditBoardDialog = () => {
    setOpen(<EditBoard key={id} id={id} name={name} />);
  };

  const handleDeleteBoardDialog = () => {
    setOpen(<DeleteBoard key={id} id={id} />);
  };

  return (
    <div className="border p-3 rounded shadow-sm">
      <div className="flex flex-row items-center justify-between">
        {/* card header */}
        <p className="font-semibold">{name}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical
              className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
              size={24}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleEditBoardDialog}>
                <Pencil size={13} className="mr-2 " />
                <p>Edit</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteBoardDialog}>
                <Trash2 size={13} className="mr-2 " />
                <p>Delete</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-row justify-between items-center mt-3">
        <p className="text-xs border p-1 px-2 rounded-full bg-gray-100 text-gray-600">
          Created By: Mitej Madan
        </p>
        <p className="text-xs text-gray-400">2 days ago</p>
      </div>
    </div>
  );
};

export default BoardCard;
