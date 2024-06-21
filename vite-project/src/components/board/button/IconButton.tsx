import React from "react";
import styles from "./IconButton.module.css";

type Props = {
  handleOnClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
};

const IconButton = ({ handleOnClick, children, isActive }: Props) => {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.button_active : ""}`}
      onClick={handleOnClick}>
      {children}
    </button>
  );
};

export default IconButton;
