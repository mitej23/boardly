import CreateBoard from "@/components/dialog/CreateBoard";
import BoardCard from "@/components/elements/BoardCard";
import SearchInput from "@/components/elements/SearchInput";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";

const Dashboard = () => {
  const { setOpen } = useModal();
  return (
    <DasboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Boards</h1>
      <div className="flex flex-row items-center justify-between">
        <SearchInput />
        {/* using math.random on key will not persist the previously enter data in the modal -- Mitej Madan  */}
        <Button onClick={() => setOpen(<CreateBoard key={Math.random()} />)}>
          Create Board
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-8">
        <BoardCard id="1" name={"First Board"} />
        <BoardCard id="2" name={"M1 Board"} />
        <BoardCard id="3" name={"Exam Board"} />
        <BoardCard id="4" name={"Dialog Board"} />
      </div>
    </DasboardLayout>
  );
};

export default Dashboard;
