import { colorToCss } from "@/lib/board_utils";
import { EllipseLayer } from "@/lib/types";
import React from "react";

type Props = {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  selected: boolean;
};

const Ellipse = ({ layer, onPointerDown, id, selected }: Props) => {
  return (
    <ellipse
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${layer?.x}px, ${layer?.y}px)`,
      }}
      cx={layer?.width / 2}
      cy={layer?.height / 2}
      rx={layer?.width / 2}
      ry={layer?.height / 2}
      fill={layer?.fill ? colorToCss(layer?.fill) : "#CCC"}
      stroke={selected ? "#2563EB" : "transparent"}
      strokeWidth="1"
    />
  );
};

export default Ellipse;
