import Link from "next/link";
import LoginButton from "../ui/LoginButton";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-3">
      <Link href={"/"} className="font-bold">つみほん</Link>
      <Link href={"/bookshelf"}>本棚</Link>
      <LoginButton />
    </div>
  );
};

export default Header;
