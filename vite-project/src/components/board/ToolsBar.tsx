import EllipseButton from "./button/EllipseButton";
import PencilButton from "./button/PencilButton";
import RectangleButton from "./button/RectangleButton";
import SelectionButton from "./button/SelectionButton";
import UndoButton from "./button/UndoButton";
import RedoButton from "./button/RedoButton";
import { CanvasMode, CanvasState, LayerType } from "@/lib/types";

type Props = {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const ToolsBar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: Props) => {
  return (
    <div className="absolute bottom-8 right-0 left-0 flex items-center justify-center">
      <div className="shadow-md border bg-white rounded-3xl bg-surface-panel flex items-center justify-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-row p-3 pr-0">
            <SelectionButton
              isActive={
                canvasState.mode === CanvasMode.None ||
                canvasState.mode === CanvasMode.Translating ||
                canvasState.mode === CanvasMode.SelectionNet ||
                canvasState.mode === CanvasMode.Pressing ||
                canvasState.mode === CanvasMode.Resizing
              }
              handleOnClick={() => setCanvasState({ mode: CanvasMode.None })}
            />
            <PencilButton
              isActive={canvasState.mode === CanvasMode.Pencil}
              handleOnClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
            />
            <RectangleButton
              isActive={
                canvasState.mode === CanvasMode.Inserting &&
                canvasState.layerType === LayerType.Rectangle
              }
              handleOnClick={() =>
                setCanvasState({
                  mode: CanvasMode.Inserting,
                  layerType: LayerType.Rectangle,
                })
              }
            />
            <EllipseButton
              isActive={
                canvasState.mode === CanvasMode.Inserting &&
                canvasState.layerType === LayerType.Ellipse
              }
              handleOnClick={() =>
                setCanvasState({
                  mode: CanvasMode.Inserting,
                  layerType: LayerType.Ellipse,
                })
              }
            />
          </div>
          {/* seperator */}
          <div className="h-8 bg-gray-300 w-[1px]"></div>
          <div className="flex flex-row p-3 pl-0">
            <UndoButton isActive={canUndo} handleOnClick={() => undo()} />
            <RedoButton isActive={canRedo} handleOnClick={() => redo()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsBar;
