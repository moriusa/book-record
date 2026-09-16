import Link from "next/link";

const Page = () => {
  return (
    <div>
      <Link href={"/bookshelf/search"}>本を追加</Link>
      <p>本一覧</p>
    </div>
  );
};

export default Page;
