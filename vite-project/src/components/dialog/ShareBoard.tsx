import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/useModal";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

const ShareBoard = ({ boardId }: { boardId: string }) => {
  const link = `http://localhost:5173/share/${boardId}`;
  const [isCopied, setIsCopied] = useState(false);
  const { isOpen, setClose } = useModal();
  const handleClose = () => setClose();
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied Successfully.",
      description: "Now you can share this link with anyone.",
    });
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      handleClose();
    }, 2000);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Shareable Link</AlertDialogTitle>
          <AlertDialogDescription>
            Copy and share this link with someone with whom you want to
            collaborate.
          </AlertDialogDescription>
          <div className="flex flex-row gap-4">
            <Input value={link} readOnly />
            <Button onClick={handleCopy}>
              {isCopied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </AlertDialogHeader>
        {/* <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ size: "sm" }))}
            onClick={() => {}}>
            Copy
          </AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShareBoard;
