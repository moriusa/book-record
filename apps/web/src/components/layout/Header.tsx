import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-3">
      <Link href={"/"} className="font-bold">つみほん</Link>
      <Link href={"/bookshelf"}>本棚</Link>
      <Link href={"/login"} className="border p-1 rounded-md">
        ログイン
      </Link>
    </div>
  );
};

export default Header;
