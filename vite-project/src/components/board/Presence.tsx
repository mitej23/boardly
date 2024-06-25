import React, { memo } from "react";
import Path from "./Path";
import { Camera, Color, PencilDraft } from "@/lib/types";
import { connectionIdToColor } from "@/lib/board_utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/useModal";
import ShareBoard from "../dialog/ShareBoard";
import { useParams } from "react-router-dom";

const Cursor = React.memo(
  ({ point, color }: { point: number[]; color?: string }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          pointerEvents: "none",
          top: point[1],
          left: point[0],
          // transform: "translate(-50%, -50%)",
        }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-mouse-pointer-2">
        <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
      </svg>
    );
  }
);

export type YPresence = {
  pencilDraft?: PencilDraft | null;
  penColor?: Color;
  selection?: string[];
  cursor?: { x: number; y: number } | null;
  clientId: number;
  user?: {
    name: string;
    email: string;
  };
};

type CursorProps = {
  camera: Camera;
  presence: YPresence[];
  provider: HocuspocusProvider;
};

const OthersCursor = ({ presence, camera, provider }: CursorProps) => {
  return (
    <>
      {presence?.map(({ cursor, clientId }) => {
        if (clientId === provider.awareness!.clientID) return null;
        if (cursor) {
          const { x, y } = cursor;
          const screenWidth = window.innerWidth - 26;
          const screenHeight = window.innerHeight - 26;
          const isWithinScreen =
            x >= camera.x &&
            y >= camera.y &&
            x <= camera.x + screenWidth &&
            y <= camera.y + screenHeight;
          if (isWithinScreen) {
            const c = [cursor.x, cursor.y];
            return (
              <Cursor
                key={clientId}
                color={connectionIdToColor(clientId)}
                point={c}
              />
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      })}
    </>
  );
};

const LiveAvatar = memo(
  ({
    presence,
    provider,
  }: {
    presence: YPresence[];
    provider: HocuspocusProvider;
  }) => {
    const { boardId } = useParams();
    const { setOpen } = useModal();

    const handleShareModal = () => {
      if (boardId) setOpen(<ShareBoard boardId={boardId} />);
    };

    return (
      <>
        {
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <div className="shadow-md border bg-white rounded-xl bg-surface-panel flex items-center justify-center">
              <div className="flex items-center justify-center space-x-2 p-2 h-14">
                {/* avatar */}
                {presence?.map(({ clientId, user }) => {
                  if (clientId === provider.awareness!.clientID) return null;
                  if (user) {
                    return (
                      <TooltipProvider key={clientId}>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger>
                            <div className="flex items-center justify-center border-2 border-white hover:border-red-500 h-8 w-8 rounded-full bg-red-200">
                              <p className="tracking-wide text-xs font-semibold text-red-500">
                                {user?.name
                                  ?.split(/\s/)
                                  .reduce(
                                    (response, word) =>
                                      (response += word.slice(0, 1)),
                                    ""
                                  )
                                  .toUpperCase()}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="bg-white rounded mr-8">
                            <div>
                              <p className="font-semibold text-sm">
                                {user?.name}
                              </p>
                              <p className="text-sm">{user?.email}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }
                })}
                <div className="flex items-center justify-center border-2 border-white hover:border-red-500 h-10 w-10 rounded-full bg-red-200">
                  <p className="tracking-wide text-xs font-semibold text-red-500">
                    You
                  </p>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-4/6 self-center"
                />
                <Button
                  size={"sm"}
                  className="self-center h-9 text-sm"
                  onClick={handleShareModal}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        }
      </>
    );
  }
);

export const OtherPencilDrafts = ({
  presence,
  provider,
}: {
  presence: YPresence[];
  provider: HocuspocusProvider;
}) => {
  return (
    <>
      {presence?.map(({ pencilDraft, clientId }) => {
        if (clientId === provider.awareness!.clientID) return null;
        if (pencilDraft != null && pencilDraft.length > 0) {
          return (
            <Path
              points={pencilDraft}
              fill={connectionIdToColor(clientId)}
              x={0}
              y={0}
              selected={false}
            />
          );
        } else null;
      })}
    </>
  );
};

const Presence = ({ camera, presence, provider }: CursorProps) => {
  return (
    <>
      <OthersCursor presence={presence} camera={camera} provider={provider} />
      <LiveAvatar presence={presence} provider={provider} />
    </>
  );
};

export default Presence;
