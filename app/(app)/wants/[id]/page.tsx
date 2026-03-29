import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { wantsRoutes } from "@/features/wants";

type WantPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function WantPage({ params }: WantPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      eyebrow="Wants"
      title={`Want 詳細 #${id}`}
      description="受け取り・評価フローを載せる詳細画面です。"
      links={wantsRoutes}
    />
  );
}
