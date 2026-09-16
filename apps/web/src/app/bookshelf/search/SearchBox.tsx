import { FaSearch } from "react-icons/fa";

export const SearchBox = () => {
  return (
    <div className="border rounded-4xl py-2 px-4 flex justify-between items-center gap-2">
      <input type="text" className="focus:outline-none w-full" />
      <FaSearch size={20} className="cursor-pointer" />
    </div>
  );
};
