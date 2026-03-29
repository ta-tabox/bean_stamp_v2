import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { searchRoutes } from "@/features/search";

export default function SearchPage() {
  return (
    <PlaceholderPage
      eyebrow="Search"
      title="検索トップ"
      description="ロースター検索とオファー検索の分岐点です。"
      links={searchRoutes}
    />
  );
}
