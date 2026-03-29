import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { beansRoutes } from "@/features/beans";

export default function BeanNewPage() {
  return (
    <PlaceholderPage
      eyebrow="Beans"
      title="豆新規作成"
      description="豆登録フォームの実装先です。"
      links={beansRoutes}
    />
  );
}
