import { colorToCss } from "@/lib/board_utils";
import { RectangleLayer } from "@/lib/types";
import React from "react";

type Props = {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  selected: boolean;
};

const Rectangle = ({ layer, onPointerDown, id, selected }: Props) => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      fill={fill ? colorToCss(fill) : "#CCC"}
      strokeWidth={1}
      stroke={selected ? "#2563EB" : "transparent"}
    />
  );
};

export default Rectangle;
