import React from "react";
import IconButton from "./IconButton";

type Props = {
  isActive: boolean;
  handleOnClick: () => void;
};

const SelectionButton = ({ isActive, handleOnClick }: Props) => {
  return (
    <IconButton isActive={isActive} handleOnClick={handleOnClick}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M13 26V9L25 21.1428H18.2189L13 26Z" fill="currentColor" />
      </svg>
    </IconButton>
  );
};

export default SelectionButton;
