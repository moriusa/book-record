import {
  RiBarcodeLine,
  RiBookmark3Line,
  RiEditLine,
  RiSearchLine,
  RiFileEditLine,
  RiListCheck2,
} from "react-icons/ri";
import type { Guide } from "@/data/guides";

const guideIcons = {
  search: RiSearchLine,
  edit: RiEditLine,
  barcode: RiBarcodeLine,
  bookTen: RiBookmark3Line,
  manual: RiFileEditLine,
  list: RiListCheck2,
};

export default function GuideIcon({
  icon,
  className,
}: {
  icon: Guide["icon"];
  className?: string;
}) {
  const Icon = guideIcons[icon];

  return <Icon className={className} aria-hidden="true" />;
}
