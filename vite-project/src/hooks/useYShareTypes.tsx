import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";

export const useUndoManager = <T extends unknown = unknown>(
  yUndoManger: Y.UndoManager
): {
  manager: Y.UndoManager;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
} => {
  const [value, setValue] = useState(yUndoManger);

  useEffect(() => {
    yUndoManger.on("stack-item-added", () => {
      setValue(yUndoManger);
    });

    yUndoManger.on("stack-item-popped", () => {
      setValue(yUndoManger);
    });
  }, [value]);

  return {
    manager: value,
    undo: () => value.undo(),
    redo: () => value.redo(),
    canUndo: value.undoStack.length > 0,
    canRedo: value.redoStack.length > 0,
  };
};

export const useMap = <T extends unknown = unknown>(
  yMap: Y.Map<T>
): {
  state: { [x: string]: T };
  get: (name: string) => T | undefined;
  set: (name: string, value: T) => void;
  delete: (name: string) => void;
} => {
  const [map, setMap] = useState<{ [x: string]: T }>(yMap.toJSON());

  useEffect(() => {
    yMap.observe((event) => {
      if (!event.transaction.local) {
        setMap(yMap.toJSON());
      }
    });
  }, []); // it is important to keep it empty because it should be able to load the initial

  return {
    state: map,
    get: useCallback(
      (name: string) => {
        return map[name];
      },
      [map]
    ),
    set: useCallback(
      (name, value) => {
        setMap({
          ...map,
          [name]: value,
        });
        yMap.set(name, value);
      },
      [map]
    ),
    delete: useCallback((name) => yMap.delete(name), [yMap]),
  };
};

export const useArray = <T extends unknown = unknown>(
  yArray: Y.Array<T>
): {
  state: T[];
  get: (index: number) => T | undefined;
  insert: (index: number, content: T[]) => void;
  delete: (index: number, length: number) => void;
  push: (content: T[]) => void;
  unshift: (content: T[]) => void;
  slice: (start: number, end?: number) => void;
  indexOf: (content: T) => number;
} => {
  const [value, setValue] = useState<T[]>(yArray.toArray());

  useEffect(() => {
    yArray.observe((_) => {
      setValue(yArray.toArray());
    });
  }, []);

  return {
    state: value,
    indexOf: useCallback((content) => value.indexOf(content), []),
    get: useCallback((index) => yArray.get(index), []),
    insert: useCallback((index, content) => yArray.insert(index, content), []),
    delete: useCallback((index, length) => yArray.delete(index, length), []),
    push: useCallback((content) => yArray.push(content), []),
    unshift: useCallback((content) => yArray.unshift(content), []),
    slice: useCallback((start, end) => yArray.slice(start, end), []),
  };
};
