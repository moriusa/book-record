import { getRakutenBookByIsbn } from "@/lib/getRakutenBookByIsbn";
import { BookForm } from "./BookForm";
type Props = {
  params: Promise<{
    isbn: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { isbn } = await params;
  const book = await getRakutenBookByIsbn(isbn);

  if (!book) {
    return <div>本が見つかりませんでした。</div>;
  }
  return (
    <div>
      <h1>本を登録</h1>
      <p>{book.title}</p>
      <BookForm />
    </div>
  );
};

export default Page;
