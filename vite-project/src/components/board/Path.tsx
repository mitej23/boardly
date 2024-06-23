import { getSvgPathFromStroke } from "@/lib/board_utils";
import getStroke from "perfect-freehand";
import { memo } from "react";

type Props = {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
  selected: boolean;
};

const Path = memo(({ x, y, onPointerDown, fill, points, selected }: Props) => {
  return (
    <path
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={fill}
      stroke={selected ? "#2563EB" : "transparent"}
      strokeWidth={1}
    />
  );
});

export default Path;
