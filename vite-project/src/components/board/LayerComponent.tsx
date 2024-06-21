import React from "react";
import Path from "./Path";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";
import { CanvasMode, LayerType, LayersMap } from "@/lib/types";
import { colorToCss } from "@/lib/board_utils";

type Props = {
  id: string;
  mode: CanvasMode;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
  selected: boolean;
  layers: LayersMap;
};

const LayerComponent = ({
  onLayerPointerDown,
  id,
  selected,
  layers,
}: Props) => {
  const layer = layers[id];
  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selected={selected}
        />
      );
    case LayerType.Path:
      return (
        <Path
          key={id}
          points={layer.points}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#CCC"}
          selected={selected}
        />
      );
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selected={selected}
        />
      );
    default:
      console.warn("Unknown layer type");
      return null;
  }
};

export default LayerComponent;
