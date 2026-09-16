import Link from "next/link";
import { SearchBox } from "./SearchBox";

const Page = () => {
  return (
    <div>
      <h1>追加する本を検索</h1>
      <SearchBox />
      <Link href={"/bookshelf/new"}>追加フォーム</Link>
    </div>
  );
};

export default Page;
