import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { beansRoutes } from "@/features/beans";

type BeanEditPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function BeanEditPage({ params }: BeanEditPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      eyebrow="Beans"
      title={`豆編集 #${id}`}
      description="Bean 編集画面のルートです。"
      links={beansRoutes}
    />
  );
}
