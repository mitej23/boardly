import IconButton from "./IconButton";

type Props = {
  isActive: boolean;
  handleOnClick: () => void;
};

const RectangleButton = ({ isActive, handleOnClick }: Props) => {
  return (
    <IconButton isActive={isActive} handleOnClick={handleOnClick}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 12H12V24H24V12ZM10 10V26H26V10H10Z"
          fill="currentColor"
        />
      </svg>
    </IconButton>
  );
};

export default RectangleButton;
