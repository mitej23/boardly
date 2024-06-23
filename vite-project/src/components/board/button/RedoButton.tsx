import { Redo2 } from "lucide-react";
import IconButton from "./IconButton";
import { cn } from "@/lib/utils";
import { memo } from "react";

type Props = {
  isActive: boolean;
  handleOnClick: () => void;
};

const RedoButton = memo(({ isActive, handleOnClick }: Props) => {
  return (
    <IconButton isActive={isActive} handleOnClick={handleOnClick}>
      <Redo2 className={cn(!isActive && "hover:cursor-not-allowed")} />
    </IconButton>
  );
});

export default RedoButton;
