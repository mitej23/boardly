import Presence, {
  OtherPencilDrafts,
  YPresence,
} from "@/components/board/Presence";
import { useArray, useMap, useUndoManager } from "@/hooks/useYShareTypes";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  MyPresence,
  PencilDraft,
  Point,
  Side,
  XYWH,
} from "@/lib/types.ts";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useUsers } from "y-presence";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import {
  colorToCss,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/board_utils";
import LayerComponent from "@/components/board/LayerComponent";
import SelectionBox from "@/components/board/SelectionBox";
import Path from "@/components/board/Path";
import ToolsBar from "@/components/board/ToolsBar";

const Board = () => {
  const { boardId } = useParams();
  const provider = useRef<HocuspocusProvider>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && boardId) {
      console.log("inside");
      provider.current = new HocuspocusProvider({
        url: "ws://127.0.0.1:3000/collaboration",
        name: boardId,
        onConnect: () => {
          console.log("started");
          setLoading(false);
        },
      });
    }
  }, [boardId]);

  if (!boardId) {
    return <p>Board does not exists!!!</p>;
  }

  if (loading) return <p>Loading...</p>;

  return provider.current && <BoardCanvas provider={provider.current} />;
};

const BoardCanvas = ({ provider }: { provider: HocuspocusProvider }) => {
  const users = useUsers(provider!.awareness!);
  const u: YPresence[] = Array.from(users.keys()).map((key) => {
    const values = users.get(key);
    return { clientId: key, ...values };
  });
  const [myPresence, setMyPresence] = useState<MyPresence>({ selection: [] });
  const {
    state: yLayers,
    set: setYLayers,
    delete: deleteYLayers,
  } = useMap<Layer>(provider.document.getMap("layers"));
  const {
    state: yLayersId,
    delete: deleteYLayersId,
    insert: insertYLayersId,
    indexOf: indexOfYLayersId,
  } = useArray<string>(provider.document.getArray("layersId"));
  const { undo, redo, canRedo, canUndo } = useUndoManager(
    new Y.UndoManager([
      provider.document.getMap("layers"),
      provider.document.getArray("layersId"),
    ])
  );

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor] = useState<Color>({
    r: 252,
    g: 142,
    b: 42,
  });
  const [pencilDraft, setPencilDraft] = useState<PencilDraft>([]);

  const deleteLayers = useCallback(() => {
    const ids = myPresence.selection;
    ids.forEach((id) => {
      deleteYLayers(id);
      const idx = indexOfYLayersId(id);
      deleteYLayersId(idx, 1);
    });
    // setting awareness
    setMyPresence((prevPresence) => ({
      ...prevPresence,
      selection: [],
    }));
    provider.setAwarenessField("selection", []);
  }, [yLayersId, myPresence, yLayers]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Backspace": {
          deleteLayers();
          break;
        }
        case "z": {
          undo();
          break;
        }
        case "y": {
          redo();
          break;
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [myPresence, yLayers, yLayersId]);

  const startDrawing = (point: Point, pressure: number) => {
    provider.setAwarenessField("pencilDraft", [[point.x, point.y, pressure]]);
    provider.setAwarenessField("penColor", lastUsedColor);
  };

  const continueDrawing = useCallback(
    (point: Point, e: React.PointerEvent) => {
      if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1) {
        return;
      }
      const { pencilDraft: awarenessPencilDraft } =
        provider.awareness?.getLocalState() as MyPresence;
      if (
        awarenessPencilDraft?.length === 1 &&
        awarenessPencilDraft[0][0] === point.x &&
        awarenessPencilDraft[0][1] === point.y
      ) {
        provider.setAwarenessField("pencilDraft", awarenessPencilDraft);
      } else {
        provider.setAwarenessField("pencilDraft", [
          ...(awarenessPencilDraft || []),
          [point.x + camera.x, point.y + camera.y, e.pressure],
        ]);
      }
      setPencilDraft((prevPencilDraft) => {
        if (
          prevPencilDraft?.length === 1 &&
          prevPencilDraft[0][0] === point.x &&
          prevPencilDraft[0][1] === point.y
        ) {
          return prevPencilDraft;
        } else {
          return [
            ...(prevPencilDraft || []),
            [point.x + camera.x, point.y + camera.y, e.pressure],
          ];
        }
      });
    },
    [canvasState.mode, camera]
  );

  const insertPath = useCallback(() => {
    provider.setAwarenessField("pencilDraft", null);
    setPencilDraft((currentPencilDraft) => {
      if (currentPencilDraft == null || currentPencilDraft.length < 2) {
        return currentPencilDraft;
      }

      const id = nanoid();
      const newLayer = penPointsToPathLayer(
        currentPencilDraft,
        lastUsedColor,
        camera
      );

      insertYLayersId(yLayersId.length, [id]);
      setYLayers(id, newLayer);

      // Update layersId and layers state
      setCanvasState((prevCanvasState) => ({
        ...prevCanvasState,
        mode: CanvasMode.Pencil,
      }));

      provider.setAwarenessField("pencilDraft", null);
      return []; // Clear the pencil draft
    });
  }, [
    lastUsedColor,
    yLayers,
    yLayersId,
    setMyPresence,
    setCanvasState,
    camera,
  ]);

  const insertLayer = useCallback(
    (layerType: LayerType.Ellipse | LayerType.Rectangle, position: Point) => {
      const layerId = nanoid();
      const newLayer = {
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      };

      insertYLayersId(yLayersId.length, [layerId]);
      setYLayers(layerId, newLayer);

      setMyPresence((prevPresence) => ({
        ...prevPresence,
        selection: [layerId],
      }));
      provider.setAwarenessField("selection", [layerId]);
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  const unselectLayers = useCallback(() => {
    setMyPresence((prevPresence) => {
      if (prevPresence?.selection?.length > 0) {
        return { ...prevPresence, selection: [] };
      }
      return prevPresence;
    });
    provider.setAwarenessField("pencilDraft", null);
  }, []);

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const updateSelectionNet = useCallback(
    (current: Point, origin: Point) => {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        yLayersId,
        yLayers,
        origin,
        current
      );

      setMyPresence((prevMyPresence) => {
        const newPresence = {
          ...prevMyPresence,
          selection: ids,
        };
        return newPresence;
      });
      provider.setAwarenessField("selection", ids);
    },
    [yLayers]
  );

  const onLayerPointerDown = useCallback(
    (e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!myPresence?.selection.includes(layerId)) {
        setMyPresence((prev) => {
          return { ...prev, selection: [layerId] };
        });
        provider.setAwarenessField("selection", [layerId]);
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, canvasState.mode, myPresence]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      // history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    []
  );

  const resizeSelectedLayer = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const layerId = myPresence.selection[0];
      const layer = yLayers[layerId];
      setYLayers(layerId, { ...layer, ...bounds });
    },
    [canvasState, myPresence.selection]
  );

  const translateSelectedLayers = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      if (!myPresence.selection || myPresence.selection.length === 0) {
        return yLayers;
      }

      const updatedLayers = { ...yLayers };

      for (const id of myPresence.selection) {
        const layer = updatedLayers[id];
        if (layer) {
          setYLayers(id, {
            ...layer,
            x: layer.x + offset.x,
            y: layer.y + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  // ===================================== Pointer Events =====================

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
      // for selection
      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setCanvasState]
  );

  const onPointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e, camera);
    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayers(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e);
    }

    setMyPresence((prev) => {
      return { ...prev, cursor: current };
    });
    provider!.setAwarenessField("cursor", current);
  };

  const onPointerLeave = () => {
    setMyPresence((prev) => {
      return { ...prev, cursor: null };
    });
    provider.setAwarenessField("cursor", null);
  };

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        console.log("insert path");
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      //   // history.resume();
    },
    [
      camera,
      canvasState.mode,
      insertPath,
      insertLayer,
      canvasState,
      unselectLayers,
    ]
  );

  return (
    <div className="board-cursor">
      <div className="touch-none">
        <svg
          className="h-screen w-screen bg-gray-100 relative"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerUp={onPointerUp}>
          <g
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px)`,
            }}>
            {yLayersId.map((layerId) => (
              <LayerComponent
                key={layerId}
                id={layerId}
                mode={canvasState.mode}
                layers={yLayers}
                onLayerPointerDown={onLayerPointerDown}
                selected={myPresence?.selection.includes(layerId) || false}
              />
            ))}
          </g>
          {/* Blue square that show the selection of the current users. Also contains the resize handles. */}
          <SelectionBox
            myPresence={myPresence}
            layers={yLayers}
            onResizeHandlePointerDown={onResizeHandlePointerDown}
            camera={camera}
          />
          {/* Selection net that appears when the user is selecting multiple layers at once */}
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-600/5 stroke-blue-600 stroke-1 "
                x={
                  Math.min(canvasState.origin.x, canvasState.current.x) +
                  camera.x
                }
                y={
                  Math.min(canvasState.origin.y, canvasState.current.y) +
                  camera.y
                }
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          {/* Drawing in progress. Still not commited to the storage. */}
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
              selected={false}
            />
          )}
          <OtherPencilDrafts presence={u} provider={provider} />
        </svg>
      </div>
      <ToolsBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={() => undo()}
        redo={() => redo()}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Presence camera={camera} presence={u} provider={provider} />
    </div>
  );
};

export default Board;
