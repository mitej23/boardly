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
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type BoardCardProps = {
  id: string;
  name: string;
  createdByName: string;
  createdById: string;
  date: string;
};

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  name,
  createdByName,
  createdById,
  date,
}) => {
  const { user } = useAuth();
  const { setOpen } = useModal();
  const navigate = useNavigate();

  const handleEditBoardDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(<EditBoard key={id} id={id} name={name} />);
  };

  const handleDeleteBoardDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(<DeleteBoard key={id} id={id} />);
  };

  const handleBoardLink = () => {
    navigate(`/board/${id}`);
  };

  return (
    <div
      className="border p-3 rounded shadow-sm hover:shadow-xl hover:cursor-pointer"
      onClick={handleBoardLink}>
      <div className="flex flex-row items-center justify-between">
        <p className="font-semibold">{name}</p>
        {user.id === createdById && (
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
        )}
      </div>
      <div className="flex flex-row justify-between items-center mt-3">
        <p className="text-xs border p-1 px-2 rounded-full bg-gray-100 text-gray-600">
          Created By: {createdByName}
        </p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
};

export default BoardCard;
