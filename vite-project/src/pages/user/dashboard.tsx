import CreateBoard from "@/components/dialog/CreateBoard";
import BoardCard from "@/components/elements/BoardCard";
import SearchInput from "@/components/elements/SearchInput";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import useGetQuery from "@/hooks/useGetQuery";
import { useModal } from "@/hooks/useModal";
import { debounce } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Board {
  boardId: string;
  boardName: string;
  createdById: string;
  createdByName: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const { data, isPending } = useGetQuery(
    "/api/boards",
    searchParams.get("query") || "",
    "boardList"
  );
  const boards: Board[] = data?.data || []; // Directly casting the type because useGetQuery is generic function
  const { setOpen } = useModal();

  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((value) => {
        setSearchParams((params) => {
          params.set("query", value);
          return params;
        });
      }, 500),
    [setSearchParams]
  );

  const handleSearchInput = (value: string) => {
    setQuery(value);
    debouncedSetSearchParams(value);
  };

  return (
    <DasboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Boards</h1>
      <div className="flex flex-row items-center justify-between">
        <SearchInput query={query} setQuery={handleSearchInput} />
        {/* using math.random on key will not persist the previously enter data in the modal -- Mitej Madan  */}
        <Button
          size={"sm"}
          onClick={() => setOpen(<CreateBoard key={Math.random()} />)}>
          Create Board
        </Button>
      </div>
      {isPending ? (
        <div className="flex h-[25rem] items-center justify-center">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          {boards.length > 0 ? (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-8">
              {boards.map(
                ({
                  boardId,
                  boardName,
                  createdByName,
                  createdById,
                  updatedAt,
                }) => {
                  return (
                    <BoardCard
                      key={boardId}
                      id={boardId}
                      name={boardName}
                      createdById={createdById}
                      createdByName={createdByName}
                      date={formatDistanceToNow(new Date(updatedAt), {
                        addSuffix: true,
                      })}
                    />
                  );
                }
              )}
            </div>
          ) : (
            <>
              <div className="flex h-[25rem] flex-col items-center justify-center">
                <h1 className="text-xl font-semibold">
                  Oops !!! No board Found.
                </h1>
                <p className="text-sm text-slate-600 my-2 mb-4">
                  Press the "Create Board" button to create your first board
                </p>
              </div>
            </>
          )}
        </>
      )}
    </DasboardLayout>
  );
};

export default Dashboard;
