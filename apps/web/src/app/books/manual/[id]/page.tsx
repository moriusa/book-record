import type { Metadata } from "next";
import ManualBookDetail from "./ManualBookDetail";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "手動登録した本",
  robots: { index: false, follow: false },
};

export default async function ManualBookPage({ params }: Props) {
  const { id } = await params;
  return <ManualBookDetail id={id} />;
}
