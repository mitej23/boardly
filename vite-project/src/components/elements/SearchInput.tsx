import { Search } from "lucide-react";
import { Input } from "../ui/input";

const SearchInput = () => {
  return (
    <div className="flex flex-row items-center">
      <Search size={20} className="absolute ml-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search Boards..."
        className="pl-12 w-[25rem]"
      />
    </div>
  );
};

export default SearchInput;
