import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useModal } from "@/hooks/useModal";
import EditBoard from "../dialog/EditBoard";

type BoardCardProps = {
  id: string;
  name: string;
};

const BoardCard: React.FC<BoardCardProps> = ({ id, name }) => {
  const { setOpen } = useModal();
  const handleEditBoardDialog = () => {
    setOpen(<EditBoard key={id} id={id} name={name} />);
  };

  return (
    <div className="border p-3 rounded shadow-sm">
      <div className="flex flex-row items-center justify-between">
        {/* card header */}
        <p className="font-semibold">{name}</p>
        <Popover>
          <PopoverTrigger asChild>
            <EllipsisVertical
              className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
              size={24}
            />
          </PopoverTrigger>
          <PopoverContent align="end" className="flex flex-col w-32 p-1 gap-1">
            <button
              onClick={() => handleEditBoardDialog()}
              className="flex items-center justify-between border rounded-sm text-sm p-1 px-3 font-semibold text-gray-700 hover:bg-gray-100">
              <p>Edit</p>
              <Pencil size={13} />
            </button>
            <button className="flex items-center justify-between border bg-red-50 border-red-100 rounded-sm text-sm p-1 px-3 text-red-400 hover:text-red-500 font-semibold hover:bg-red-100">
              <p>Delete</p>
              <Trash2 size={13} />
            </button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row justify-between mt-2">
        <p className="text-sm">Created By: Mitej Madan</p>
        <p className="text-sm">2 days ago</p>
      </div>
    </div>
  );
};

export default BoardCard;
