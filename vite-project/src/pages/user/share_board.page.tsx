import { useNavigate, useParams } from "react-router-dom";
import NotFound from "../404";
import usePostQuery from "@/hooks/usePostQuery";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ShareBoard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = usePostQuery(`/api/boards/share`);

  const handleCreateBoard = () => {
    mutate(
      {
        boardId: boardId,
      },
      {
        onSuccess: (data) => {
          toast({
            title: data.message,
            description: "You can now access this board from dashboard.",
          });
          navigate(`/board/${boardId}`);
        },
        onError: () => {
          toast({
            title: "Oops!! Board doesn't exists",
            description: "Check whether the link is correct..",
          });
          navigate("/dashboard");
        },
      }
    );
  };

  useEffect(() => {
    handleCreateBoard();
  }, []);

  if (!boardId) {
    return <NotFound />;
  }

  if (isPending)
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <Loader className="animate-spin" size={20} />
      </div>
    );
};

export default ShareBoard;
