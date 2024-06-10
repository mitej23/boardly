import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/useModal";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import usePostQuery from "@/hooks/usePostQuery";
import { toast } from "../ui/use-toast";
import { Loader } from "lucide-react";

type DeleteBoardProps = {
  id: string;
};

const DeleteBoard: React.FC<DeleteBoardProps> = ({ id }) => {
  const { mutate, isPending } = usePostQuery("/api/boards/deleteBoard");
  const queryClient = useQueryClient();
  const { isOpen, setClose } = useModal();
  const handleClose = () => setClose();

  const handleDeleteBoard = () => {
    mutate(
      {
        id: id,
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
          handleClose();
        },
      }
    );
    setClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({ size: "sm", variant: "destructive" })
            )}
            onClick={handleDeleteBoard}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Delete Board"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBoard;
