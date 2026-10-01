import Link from "next/link";
import AuthButton from "../ui/AuthButton";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-3">
      <Link href={"/"} className="font-bold">つみほん</Link>
      <Link href={"/bookshelf"}>本棚</Link>
      <AuthButton />
    </div>
  );
};

export default Header;
